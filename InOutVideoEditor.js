var InOutVideoEditor = function(params) {

    this.internal = {
        video: null,
        fps: 0,
    };

    this.__construct = function() {
        if (params) {
            this.setVideo(params.video);
            this.setFps(params.fps);
        }
    };

    this.init = function() {
        this.internal.currentTime = 0;
        this.internal.loaded = false;
        this.internal.beginAt = 0;
        this.internal.endAt = 0;

        var self = this;
        var video = this.getVideo();
        $(video).bind('loadedmetadata', function() {
            $(self).trigger('loaded');
        });
        $(video).bind('timeupdate', function() {
            if (self.internal.loaded) {
                if ( ! self.internal.video.paused ) {
                    self.internal.currentTime = self.internal.video.currentTime;
                }
                $(self).trigger('updated');
            } else {
                self.internal.loaded = true;
            }
        });
    };

    this.setFps = function(fps) {
        this.internal.fps = fps || 0;
    };

    this.getFps = function() {
        if (this.internal.fps == 0) {
            throw new Error('fps not set');
        }
        return this.internal.fps;
    };

    this.setVideo = function(video) {
        if (typeof(video) == "string") {
            this.internal.video = $('<video src="' + video + '"/>').get(0);
        }
        if (typeof(video) == "object") {
            this.internal.video = video.get(0);
        }
    };

    this.getVideo = function() {
        if (this.internal.video == null) {
            throw new Error('video not set');
        }
        return this.internal.video;
    };

    this.timeToFrame = function(time) {
        return Math.floor(time * this.getFps());
    };

    this.frameToTime = function(frame) {
        return frame / this.getFps();
    };

    this.setCurrentTime = function(time) {
        if (time < 0 || time > this.getVideoDuration()) {
            throw new Error('time out of range');
        }
        this.internal.currentTime = time;
        this.getVideo().currentTime = time;
    };

    this.getCurrentTime = function() {
        return this.internal.currentTime;
    };

    this.setCurrentFrame = function(frame) {
        if (frame < 0 || frame > this.getTotalFrames()) {
            throw new Error('frame out of range');
        }
        this.setCurrentTime(this.frameToTime(frame))
    };

    this.getCurrentFrame = function() {
        return this.timeToFrame(this.getCurrentTime());
    };

    this.moveFrames = function(frames) {
        var newFrame = this.getCurrentFrame() + frames;
        this.setCurrentFrame(newFrame);
    };

    this.moveTime = function(time) {
        var newTime = this.getCurrentTime() + time;
        this.setCurrentTime(newTime);
    };

    this.getVideoDuration = function() {
        return this.getVideo().duration;
    };

    this.getVideoWidth = function() {
        return this.getVideo().videoWidth;
    };

    this.getVideoHeight = function() {
        return this.getVideo().videoHeight;
    };

    this.getTotalFrames = function() {
        return this.timeToFrame(this.getVideo().duration);
    };

    this.setBeginAt = function() {
        this.internal.beginAt = this.getCurrentFrame();
    };

    this.setEndAt = function() {
        this.internal.endAt = this.getCurrentFrame();
    };

    this.getBeginAt = function() {
        return this.internal.beginAt;
    };

    this.getEndAt = function() {
        return this.internal.endAt;
    };

    this.on = function(event, handler) {
        $(this).on(event, handler);
    };

    this.__construct();

};
