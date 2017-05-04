/**
 * Mathematical.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { TweenManager } from './TweenManager';
import { Interpolation } from './Interpolation';

class MathTween {

    constructor(object, props, time, ease, delay, callback) {
        let self = this;
        let startTime, startValues, endValues, paused, elapsed;

        initMathTween();

        function initMathTween() {
            TweenManager.clearTween(object);
            TweenManager.addMathTween(self);
            object.mathTween = self;
            ease = Interpolation.convertEase(ease);
            startTime = Date.now();
            startTime += delay;
            endValues = props;
            startValues = {};
            for (let prop in endValues) if (typeof object[prop] === 'number') startValues[prop] = object[prop];
        }

        function clear(stop) {
            object.mathTween = null;
            if (!stop) for (let prop in endValues) if (typeof endValues[prop] === 'number') object[prop] = endValues[prop];
            TweenManager.removeMathTween(self);
        }

        this.update = time => {
            if (paused || time < startTime) return;
            elapsed = (time - startTime) / time;
            elapsed = elapsed > 1 ? 1 : elapsed;
            let delta = ease(elapsed);
            for (let prop in startValues) {
                if (typeof startValues[prop] === 'number') {
                    let start = startValues[prop],
                        end = endValues[prop];
                    object[prop] = start + (end - start) * delta;
                }
            }
            if (elapsed === 1) {
                clear();
                if (callback) callback();
            }
        };

        this.pause = () => {
            paused = true;
        };

        this.resume = () => {
            paused = false;
            startTime = Date.now() - elapsed * time;
        };

        this.stop = () => clear(true);
    }
}

export { MathTween };
