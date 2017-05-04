/**
 * Spring math.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { TweenManager } from './TweenManager';

class SpringTween {

    constructor(object, props, friction, ease, delay, callback) {
        let self = this;
        let startTime, velocityValues, endValues, startValues, damping, count, paused;

        initSpringTween();

        function initSpringTween() {
            TweenManager.clearTween(object);
            TweenManager.addMathTween(self);
            object.mathTween = self;
            startTime = Date.now();
            startTime += delay;
            endValues = {};
            startValues = {};
            velocityValues = {};
            if (props.x || props.y || props.z) {
                if (typeof props.x === 'undefined') props.x = object.x;
                if (typeof props.y === 'undefined') props.y = object.y;
                if (typeof props.z === 'undefined') props.z = object.z;
            }
            count = 0;
            damping = props.damping || 0.1;
            delete props.damping;
            for (let prop in props) {
                if (typeof props[prop] === 'number') {
                    velocityValues[prop] = 0;
                    endValues[prop] = props[prop];
                }
            }
            for (let prop in props) {
                if (typeof object[prop] === 'number') {
                    startValues[prop] = object[prop] || 0;
                    props[prop] = startValues[prop];
                }
            }
        }

        function clear(stop) {
            object.mathTween = null;
            if (!stop) for (let prop in endValues) if (typeof endValues[prop] === 'number') object[prop] = endValues[prop];
            TweenManager.removeMathTween(self);
        }

        this.update = time => {
            if (paused || time < startTime) return;
            let vel;
            for (let prop in startValues) {
                if (typeof startValues[prop] === 'number') {
                    let end = endValues[prop],
                        val = props[prop],
                        d = end - val,
                        a = d * damping;
                    velocityValues[prop] += a;
                    velocityValues[prop] *= friction;
                    props[prop] += velocityValues[prop];
                    object[prop] = props[prop];
                    vel = velocityValues[prop];
                }
            }
            if (Math.abs(vel) < 0.001) {
                count++;
                if (count > 30) {
                    clear();
                    if (callback) callback();
                }
            }
        };

        this.pause = () => {
            paused = true;
        };

        this.stop = () => clear(true);
    }
}

export { SpringTween };
