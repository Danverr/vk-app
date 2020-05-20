import FlareComponent from "flare-react";

class petController extends FlareComponent.Controller {
    constructor() {
        super();
        this.fly = null;
        this.errorFace = null;
        this.time = 0;
    }

    initialize(artboard) {
        this.fly = artboard.getAnimation("fly");
        this.errorFace = artboard.getAnimation("errorFace");
    }

    advance(artboard, elapsed) {
        // advance the walk time
        this.time += elapsed;

        // mix the two animations together by applying one and then the other (note that order matters).
        this.fly.apply(this.time % this.fly.duration, artboard, 1.0);

        // if you want to slowly disable the head bobbing (musicWalk animation) you could ramp down the
        // final argument (the mix argument) to 0.0 over some time. For now we're mixing at full strength.
        //this.errorFace.apply(this.time % this.errorFace.duration, artboard, 1.0);

        // keep rendering
        return true;
    }
}

export default petController;