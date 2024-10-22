const express = require('express')
const app = express()
const port = 3000
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const jwt = require('jsonwebtoken');

const secretKey = 'Paki47tan'

const usersData = new Map([
    [
        'misal2723',
        {
            password: 'pass123',
            email: 'misal@gmail.com',
            name: 'Misal Khan',
            role: 'Super Admin',
            // array of posts with objects and each post has postId, content, likes, comments and commentsList
            posts: [
                {
                    postId: 1,
                    content: 'Just finished my first React project!',
                    likes: 120,
                    likedList: [],
                    comments: 15,
                    commentsList: []
                },
                {
                    postId: 2,
                    content: 'Exploring new places in Lahore!',
                    likes: 80,
                    likedList: [],
                    comments: 8,
                    // each post has multiple comments and to store comments, I'm using array
                    commentsList: []
                },
                {
                    postId: 3,
                    content: 'Can anyone recommend a good book on web development?',
                    likes: 45,
                    likedList: [],
                    comments: 5,
                    commentsList: []
                }
            ]
        }
    ],
    [
        'khan777',
        {
            password: 'securePass321',
            email: 'khan@gmail.com',
            name: 'Khan Ali',
            role: 'Admin',
            posts: [{
                postId: 4,
                content: 'Learning full-stack development!',
                likes: 100,
                likedList: [],
                comments: 20,
                commentsList: []
            },
            {
                postId: 5,
                content: 'Started working on my portfolio website.',
                likes: 75,
                likedList: [],
                comments: 10,
                commentsList: []
            },
            {
                postId: 6,
                content: 'Just watched an amazing movie last night!',
                likes: 65,
                likedList: [],
                comments: 3,
                commentsList: []
            }
            ]
        }],
    [
        'ahmad2723', {
            password: 'ahmad@567',
            name: 'Ahmad Iqbal',
            role: 'Admin',
            email: 'ahmad@gmail.com',
            posts: [{
                postId: 7,
                content: 'Attended a JavaScript workshop today.',
                likes: 90,
                likedList: [],
                comments: 12,
                commentsList: []
            },
            {
                postId: 8,
                content: 'Joined a local tech community!',
                likes: 55,
                likedList: [],
                comments: 9,
                commentsList: []
            },
            {
                postId: 9,
                content: 'Preparing for my next coding interview.',
                likes: 70,
                likedList: [],
                comments: 7,
                commentsList: []
            }
            ]
        }
    ],
    ['mk2723', {
        password: 'mk7890',
        email: 'mk@gmail.com',
        name: 'Muhammad Kashif',
        role: 'Admin',
        posts: [{
            postId: 10,
            content: 'Just completed a Python automation project.',
            likes: 110,
            likedList: [],
            comments: 18,
            commentsList: []
        },
        {
            postId: 11,
            content: 'Looking for job opportunities in software development.',
            likes: 85,
            likedList: [],
            comments: 6,
            commentsList: []
        },
        {
            postId: 12,
            content: 'What’s the best way to learn Django?',
            likes: 60,
            likedList: [],
            comments: 4,
            commentsList: []
        }
        ]
    }]
]);

function authenticateToken(req, res, next) {
    let token = req.headers.token
    if (token) {
        let decoded = jwt.verify(token, secretKey)
        req.user = decoded
        next()
    }
    else {
        return res.status(401).json({
            message: 'Token is required'
        })
    }
}

function findUser(email) {
    for (const [username, userData] of usersData) {
        if (userData.email === email) {
            return userData;
        }
    }
    return null;
}

app.post('/login', authenticateToken, (req, res) => {
    const { email, password } = req.body;
    let user = findUser(email);
    console.log(user)
    if (user) {
        if (user.email === email && user.password === password) {
            const token = jwt.sign({ email: email }, secretKey);
            return res.status(200).json({
                message: 'Logged in successfully',
                token
            })
        } else {
            return res.status(401).json({
                message: 'Invalid email or password'
            })
        }
    } else {
        return res.status(401).json({
            message: "Email doesn't exist"
        })
    }
})

app.get('/allUsersposts', authenticateToken, (req, res) => {
    let token = req.user.email
    let user = findUser(token)
    console.log(user)
    if (user) {
        let allPosts = Array.from(usersData.values()).flatMap(userData => {
            if (userData.email !== user.email) {
                return userData.posts
            }
            return []
        });
        return res.status(200).json(allPosts)
    }
    else {
        return res.status(403).json({
            message: 'You are not authorized to access this resource'
        })
    }
})

app.get('/activeUserPosts', authenticateToken, (req, res) => {
    console.log(req.user, 'kzjxkjz')
    let token = req.user.email
    let user = findUser(token)
    console.log(user)
    if (user) {
        let allPosts = Array.from(usersData.values()).flatMap(userData => {
            if (userData.email === user.email) {
                return userData.posts
            }
            return []
        }
        );
        return res.status(200).json(allPosts)
    }
    else {
        return res.status(403).json({
            message: 'You are not authorized to access this resource'
        })
    }
})



app.listen(port, () => {
    console.log(`Code run on ${port}`)
})