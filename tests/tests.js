$(document).ready(function() {

    var video = " ../videos/big_buck_bunny_1080p_h264.mov";
    var fps = 24;
    var videoDuration = 596.48;
    var totalFrames = 14315;
    var timeOnFrame10 = 0.4166666666666667;
    var frameOnTime10 = 240;
    var moveFrames = 10;
    var moveSeconds = 15.05;

    module("Sync tests");

    test("Raise exception on getting video not set", function() {
        var editor = new InOutVideoEditor();
        var description = "video not set";
        throws(editor.getVideo, description, "raised error '" + description + "'");
    });

    test("Raise exception on getting fps not set", function() {
        var editor = new InOutVideoEditor();
        var description = "fps not set";
        throws(editor.getFps, description, "raised error '" + description + "'");
    });

    test("Get video object", function() {
        var editor = new InOutVideoEditor({ video: video });
        equal(typeof(editor.getVideo()), "object", "getVideo() returns object");
    });

    test("Get fps", function() {
        var editor = new InOutVideoEditor({ fps: fps });
        equal(editor.getFps(), fps, "getFps() equals " + fps);
    });

    test("Convert time to frame (fps = 25)", function() {
        var editor = new InOutVideoEditor({ fps: 25 });
        equal(editor.timeToFrame(0),     0, "timeToFrame(0) equals 0");
        equal(editor.timeToFrame(0.039), 0, "timeToFrame(0.039) equals 0");
        equal(editor.timeToFrame(0.04),  1, "timeToFrame(0.04) equals 1");
        equal(editor.timeToFrame(0.079), 1, "timeToFrame(0.079) equals 1");
        equal(editor.timeToFrame(0.08),  2, "timeToFrame(0.08) equals 2");
        equal(editor.timeToFrame(0.119), 2, "timeToFrame(0.119) equals 2");
        equal(editor.timeToFrame(0.12),  3, "timeToFrame(0.12) equals 3");
    });

    test("Convert frame to time (fps = 25)", function() {
        var editor = new InOutVideoEditor({ fps: 25 });
        equal(editor.frameToTime(0),    0, "frameToTime(0) equals 0");
        equal(editor.frameToTime(1), 0.04, "frameToTime(1) equals 0.4");
        equal(editor.frameToTime(2), 0.08, "frameToTime(2) equals 0.08");
        equal(editor.frameToTime(3), 0.12, "frameToTime(3) equals 0.12");
    });

    module("Async tests", {
        setup: function() {
            this.editor = new InOutVideoEditor({ fps: fps, video: video });
        }
    });

    asyncTest("Get video duration (fps = " + fps + ")", function() {
        this.editor.on('loaded', function() {
            equal(
                this.getVideoDuration(),
                videoDuration,
                "getVideoDuration() equals " + videoDuration
            );
            start();
        });
        this.editor.init();
    });

    asyncTest("Get total frames (fps = " + fps + ")", function() {
        this.editor.on('loaded', function() {
            equal(
                this.getTotalFrames(),
                totalFrames,
                "getTotalFrames() equals " + totalFrames
            );
            start();
        });
        this.editor.init();
    });

    asyncTest("Get current frame after set current time (fps = " + fps + ")", function() {
        this.editor.on('loaded', function() {
            this.setCurrentTime(10);
        });
        this.editor.on('updated', function() {
            equal(
                this.getCurrentFrame(),
                frameOnTime10,
                "setCurrentTime(10), then getCurrentFrame() equals " + frameOnTime10
            );
            start();
        });
        this.editor.init();
    });

    asyncTest("Get current time after set current frame (fps = " + fps + ")", function() {
        this.editor.on('loaded', function() {
            this.setCurrentFrame(10);
        });
        this.editor.on('updated', function() {
            equal(
                this.getCurrentTime(),
                timeOnFrame10,
                "setCurrentFrame(10), then getCurrentTime() equals " + timeOnFrame10
            );
            start();
        });
        this.editor.init();
    });

    asyncTest("Move +" + moveFrames + " frames", function() {
        this.editor.on('loaded', function() {
            this.moveFrames(moveFrames);
        });
        this.editor.on('updated', function() {
            equal(
                this.getCurrentFrame(),
                moveFrames,
                "moveFrames(" + moveFrames + "), then getCurrentFrame() equals " + moveFrames
            );
            start();
        });
        this.editor.init();
    });

    asyncTest("Raise exception on move to frame out of range (-" + moveFrames + ")", function() {
        var self = this;
        this.editor.on('loaded', function() {
            description = "frame out of range";
            throws(function() {
                self.moveFrames(-moveFrames);
            }, description, "raised error '" + description + "'");
            start();
        });
        this.editor.init();
    });

    asyncTest("Move +" + moveSeconds + " seconds", function() {
        this.editor.on('loaded', function() {
            this.moveTime(moveSeconds);
        });
        this.editor.on('updated', function() {
            equal(
                this.getCurrentTime(),
                moveSeconds,
                "moveTime(" + moveSeconds + "), then getCurrentTime() equals " + moveSeconds
            );
            start();
        });
        this.editor.init();
    });

    asyncTest("Raise exception on move to time out of range (-" + moveSeconds + "s)", function() {
        var self = this;
        this.editor.on('loaded', function() {
            description = "time out of range";
            throws(function() {
                self.moveTime(-moveSeconds);
            }, description, "raised error '" + description + "'");
            start();
        });
        this.editor.init();
    });
});
