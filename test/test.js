var video = " ../videos/big_buck_bunny_1080p_h264.mov";
var fps = 24;
var videoDuration = 596.48;
var totalFrames = 14315;
var timeOnFrame10 = 0.4166666666666667;
var frameOnTime10 = 240;
var moveFrames = 10;
var moveSeconds = 15.05;

describe("Sync tests", function() {

    it("Raise exception on getting video not set", function() {
        var editor = new InOutVideoEditor();
        (function(){editor.getVideo()}).should.throw('video not set');
    });

    it("Raise exception on getting fps not set", function() {
        var editor = new InOutVideoEditor();
        (function(){editor.getFps()}).should.throw('fps not set');
    });

    it("Get video object", function() {
        var editor = new InOutVideoEditor({ video: video });
        (typeof(editor.getVideo())).should.eql("object");
    });

    it("Get fps", function() {
        var editor = new InOutVideoEditor({ fps: fps });
        editor.getFps().should.eql(fps);
    });

    it("Convert time to frame (fps = 25)", function() {
        var editor = new InOutVideoEditor({ fps: 25 });
        editor.timeToFrame(0).should.eql(0);
        editor.timeToFrame(0.039).should.eql(0);
        editor.timeToFrame(0.04).should.eql(1);
        editor.timeToFrame(0.079).should.eql(1);
        editor.timeToFrame(0.08).should.eql(2);
        editor.timeToFrame(0.119).should.eql(2);
        editor.timeToFrame(0.12).should.eql( 3);
    });

    it("Convert frame to time (fps = 25)", function() {
        var editor = new InOutVideoEditor({ fps: 25 });
        editor.frameToTime(0).should.eql(0);
        editor.frameToTime(1).should.eql(0.04);
        editor.frameToTime(2).should.eql(0.08);
        editor.frameToTime(3).should.eql(0.12);
    });

});

describe("Async tests", function() {

    var editor = null;

    beforeEach(function() {
        editor = new InOutVideoEditor({ fps: fps, video: video });
    })

    it("Get video duration (fps = " + fps + ")", function(done) {
        editor.on('loaded', function() {
            this.getVideoDuration().should.eql(videoDuration);
            done();
        });
        editor.init();
    });

    it("Get current frame after set current time (fps = " + fps + ")", function(done) {
        editor.on('loaded', function() {
            this.setCurrentTime(10);
        });
        editor.on('updated', function() {
            this.getCurrentFrame().should.eql(frameOnTime10);
            done();
        });
        editor.init();
    });

    it("Get current time after set current frame (fps = " + fps + ")", function(done) {
        editor.on('loaded', function() {
            this.setCurrentFrame(10);
        });
        editor.on('updated', function() {
            this.getCurrentTime().should.eql(timeOnFrame10);
            done();
        });
        editor.init();
    });

    it("Move +" + moveFrames + " frames", function(done) {
        editor.on('loaded', function() {
            this.moveFrames(moveFrames);
        });
        editor.on('updated', function() {
            this.getCurrentFrame().should.eql(moveFrames);
            done();
        });
        editor.init();
    });

    it("Raise exception on move to frame out of range (-" + moveFrames + ")", function(done) {
        editor.on('loaded', function() {
            (function(){editor.moveFrames(-moveFrames)}).should.throw('frame out of range');
            done();
        });
        editor.init();
    });

    it("Move +" + moveSeconds + " seconds", function(done) {
        editor.on('loaded', function() {
            this.moveTime(moveSeconds);
        });
        editor.on('updated', function() {
            this.getCurrentTime().should.eql(moveSeconds);
            done();
        });
        editor.init();
    });

    it("Raise exception on move to time out of range (-" + moveSeconds + "s)", function(done) {
        editor.on('loaded', function() {
            (function(){editor.moveTime(-moveSeconds)}).should.throw('time out of range');
            done();
        });
        editor.init();
    });

});
