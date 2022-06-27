const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

router.use(express.json());

// grabbing all the videos data from videos.json file and converting it into a usable readble object

const readFile = () => {
    const videoData = fs.readFileSync("./data/videos.json");
    return JSON.parse(videoData);
    };

const writeFile = (videoData) => {
    fs.writeFileSync("./data/videos.json", JSON.stringify(videoData));
    };

//return only the needed keys for videosList
router.get("/", (req, res) => {
    let videoData = readFile();
    videosList = videoData.map((video) => ({
        id: video.id,
        title: video.title,
        channel: video.channel,
        image: video.image,
    }));
    return res.status(200).json(videosList);
    });

//post request validation
router.post("/", (req, res) => {
    let videos = readFile();
    let image = req.body.image;
    if (!image) {
        image = "http://localhost:8080/images/Upload-video-preview.jpg"
    }

    const newVideo = {
        id: uuidv4(),
        title: req.body.title,
        description: req.body.description,
        channel: "Station of the Brain",
        image: image,
        views: 0,
        likes: 0,
        duration: Math.floor(Math.random()) + ":" + Math.floor(Math.random() * 100),
        video: "https://project-2-api.herokuapp.com/stream",
        timestamp: Date.now(),
    //default mock comments
        comments: [
        {
            name: "Jeon JungKook",
            comment:
            "Memories follow me left and right, I can feel you over here",
            likes: 0,
            timestamp: Date.now(),
        },
        {
            name: "Kim Taehyung",
            comment:
            "Wow, amazing! My fishes No. 1 and No. 2 are really enjoying their aquarium now that I've learned to clean it properly. Big fan!!",
            likes: 0,
            timestamp: Date.now(),
        },
        ],
    };

    videos.push(newVideo);
    writeFile(videos);

    res.status(200).json(newVideo);
});

//match the params.id with the data using .find() for individual videos
router.get("/:id", (req, res) => {
    const individualVideo = readFile().find((video) => video.id === req.params.id);

    if (!individualVideo) {
        res.status(404).json({
        message: "Team not found",
        });
        return;
    }

    res.status(200).json(individualVideo);
    });

    
router.post("/:id/comments", (req, res) => {
    let videos = readFile();
    const currentDate = new Date();
    
    let newVideo = videos.find((video) => video.id === req.params.id);
    
    newVideo.comments.push({
        id: uuidv4(),
        name: req.body.name,
        comment: req.body.comment,
        likes: "0",
        timestamp: currentDate.getTime(),
    });
    
    let newVideoList = videos.map((video) => {
        if (video.id === req.params.id) {
        return newVideo;
        }
        return video;
    });
    
    writeFile(newVideoList);
    res.status(200).json(newVideoList);
    });

router.delete("/:id/comments/:commentId", (req, res) => {
    let videos = readFile();
    let newVideos = videos.map((video) => {
        let newComments = video.comments.filter((comment) => {
        if (comment.id !== req.params.commentId) {
            return comment;
        }
        });
        video.comments = newComments;
        return video;
    });
    writeFile(newVideos);
    res.status(200).json(newVideos);
    });

    module.exports = router;