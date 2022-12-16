import React, { useContext, useEffect, useState } from "react";
import Comment from "../Comment/Comment.js";
import { AuthContext } from "../../context/AuthContext.js";
import "./indexpost.css";
import axios from "axios";
import { MAIN_URL, public_folder } from "../../variable.js";
import {format} from "timeago.js";
import {imageWithCapitalExt} from "../../api.js";

const IndexPost = ({isFriendsProfile, isStrangersProfile, stranger}) => {
    const {isCreated} = useContext(AuthContext);
    const {user} = useContext(AuthContext);

    const [userPosts, setUserPosts] = useState([]);
    const [friendsPosts, setFriendsPosts] = useState([]);
    const [strangersPosts, setStrangersPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [text, setText] = useState("");

    useEffect(() => {
        const getPosts = async () => {
            const posts = await axios.get(`${MAIN_URL}/api/posts/${user._id}`);
            let sorted = posts.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            let userPosts = [], friendsPosts = [];
            sorted.forEach((post) => {
                if (post.creatorId === user._id) userPosts.push(post);
                else friendsPosts.push(post);
            });
            setUserPosts(userPosts);
            setFriendsPosts(friendsPosts);
        };
        if (isCreated) {
            getPosts();
        }
    }, [isCreated]);

    useEffect(() => {
        const getPosts = async () => {
            try {
                const posts = await axios.get(`${MAIN_URL}/api/posts/`);
                let sorted = posts.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                let userPosts = [], friendsPosts = [];
                sorted.forEach((post) => {
                    if (post.creatorId === user._id) userPosts.push(post);
                    else friendsPosts.push(post);
                });
                setUserPosts(userPosts);
                setFriendsPosts(friendsPosts);
            } catch (error) {
                console.log("error:", error);
            }
        };
        const getComments = async () => {
            try {
                const comments = await axios.get(`${MAIN_URL}/api/comments/`);
                setComments(comments.data);
            } catch (error) {
                console.log("error:", error);
            }
        };

        const getStrangersPosts = async () => {
            try {
                const posts = await axios.get(`${MAIN_URL}/api/posts/`);
                let sorted = posts.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                let strangers = [];
                sorted.forEach((post) => {
                    if (post.creatorId === stranger._id) strangers.push(post);
                });
                console.log("strangers:", JSON.stringify(strangers));
                setStrangersPosts(strangers);
            } catch (error) {
                console.log("error:", error);
            }
        };
        getPosts();
        getComments();
        if (isStrangersProfile) getStrangersPosts();
    }, []);

    const createComment = async (postId) => {
        try {
            const response = await axios.post(`${MAIN_URL}/api/comments/create`, {
                text,
                username: user.username,
                creatorId: user._id,
                creatorImg: user.profile_img,
                postId
            });
            if (response.data) setComments(comments => [...comments, response.data]);
        } catch (error) {
            
        }
        setText("");
    }

    const likePost = async (postCreator, postId) => {
        try {
            const post = await axios.post(`${MAIN_URL}/api/posts/${postId}`);
            if (post.data.creatorId === user._id) {
                alert("You cannot like your own post!");
            } else {
                if (!post.data.likes.includes(user._id)) {
                    const response = await axios.post(`${MAIN_URL}/api/posts/like`, {creatorId: user._id, postId});
                    if (response.data.length) {
                        if (postCreator === "user") setUserPosts(userPosts => [...userPosts, response.data]);
                        if (postCreator === "friend") setFriendsPosts(friendPosts => [...friendPosts, response.data]);
                    }
                } else {
                    alert("You cannot like a post twice! OK?");
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    const allFriendsPosts = user?.friends.map(friend => {
        return (
            friendsPosts.map(friendPost => {
                return friendPost.creatorId === friend ? (
                    <article key={friendsPosts.indexOf(friendPost)} className="post">
                        <div className="post__container">
                            <div className="post__header">
                                <div className="user__img">
                                    <img src={friendPost.img ? (public_folder + "posts/" + friendPost.img) : ""} alt="Post" />
                                </div>
                                <div className="title">
                                    <div className="title__content">
                                        <span>{friendPost.creatorUsername}</span>
                                        <p>{format(friendPost.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="post__content">
                                <div className="description">
                                    <p>{friendPost.text}</p>
                                </div>
                                <div className="image">
                                    <img src={friendPost.img ? (public_folder + "posts/" + friendPost.img) : ""} alt="Post" />
                                </div>
                                <div className="likes">
                                    <div className="count">
                                        <span className="like__btn">
                                            <img src="/assets/images/like.png" onClick={() => likePost("friend", friendPost._id)} alt="Like it" />
                                        </span>
                                        <span>{friendPost.likes ? friendPost.likes.length : "0"}</span>
                                    </div>
                                    <div className="comments">
                                        <span>{comments.filter(comment => comment.postId === friendPost._id).length} comments</span>
                                    </div>
                                </div>
                                <hr />
                                {comments ? (
                                    comments.map(comment => (
                                        comment.postId === friendPost._id ? <Comment friendId={friend} key={comments.indexOf(comment)} creatorId={comment.creatorId} username={comment.username} text={comment.text} profile_img={comment.creatorImg}/> : null
                                    ))
                                ) : (<span></span>)}
                                <div className="add__comment">
                                    <input value={text} onChange={(e) => setText(e.target.value)} type="text" placeholder="Enter your comment" />
                                    <button type="button" onClick={() => createComment(friendPost._id)}>Send</button>
                                </div>
                            </div>
                        </div>
                    </article>
                ) : (<span></span>)
            })
        )
    })

    const userAllPosts = userPosts.length > 0 ? userPosts.map(post => (
        <article key={userPosts.indexOf(post)} className="post">
            <div className="post__container">
                <div className="post__header">
                    <div className="user__img">
                        <img src={user?.profile_img === "noAvatar-big.png" ? (public_folder + user?.profile_img) : (public_folder + "users/" + user?.profile_img)} alt="Post" />
                    </div>
                    <div className="title">
                        <div className="title__content">
                            <a href="#">{post.creatorUsername}</a>
                            {console.log("format(post.createdAt):", format(post.createdAt))}
                            <p>{format(post.createdAt)}</p>
                        </div>
                    </div>
                </div>
                <div className="post__content">
                    <div className="description">
                        <p>{post.text}</p>
                    </div>
                    <div className="image">
                        <img src={post.img ? (public_folder + "posts/" + post.img) : ""} alt="Post" />
                    </div>
                    <div className="likes">
                        <div className="count">
                            <span className="like__btn">
                                <img src="/assets/images/like.png" alt="Like it" onClick={() => likePost("user", post._id)} />
                            </span>
                            <span>{post.likes ? post.likes.length : "0"}</span>
                        </div>
                        <div className="comments">
                            <span>{comments.filter(comment => comment.postId === post._id).length} comments</span>
                        </div>
                    </div>
                    <hr />
                    {comments ? (
                        comments.map(comment => (
                            comment.postId === post._id ? <Comment friendId={null} key={comments.indexOf(comment)} creatorId={comment.creatorId} username={comment.username} text={comment.text} profile_img={comment.creatorImg}/> : null
                        ))
                    ) : (<span></span>)}
                    <div className="add__comment">
                        <input value={text} onChange={(e) => setText(e.target.value)} type="text" placeholder="Enter your comment" />
                        <button type="button" onClick={() => createComment(post._id)}>Send</button>
                    </div>
                </div>
            </div>
        </article>
    )) : [];

    const strangersAllPosts = strangersPosts.length > 0 ? strangersPosts.map(post => {
        return <article key={strangersPosts.indexOf(post)} className="post">
            <div className="post__container">
                <div className="post__header">
                    <div className="user__img">
                        <img src={stranger?.profile_img === "noAvatar-big.png" ? (public_folder + stranger?.profile_img) : (public_folder + "users/" + stranger?.profile_img)} alt="Post" />
                    </div>
                    <div className="title">
                        <div className="title__content">
                            <a href="#">{post.creatorUsername}</a>
                            <p>{format(post.createdAt)}</p>
                        </div>
                    </div>
                </div>
                <div className="post__content">
                    <div className="description">
                        <p>{post.text}</p>
                    </div>
                    <div className="image">
                        <img src={post.img ? (public_folder + "posts/" + post.img) : ""} alt="Post" />
                    </div>
                    <div className="likes">
                        <div className="count">
                            <span className="like__btn">
                                <img src="/assets/images/like.png" alt="Like it" onClick={() => likePost("user", post._id)} />
                            </span>
                            <span>{post.likes ? post.likes.length : "0"}</span>
                        </div>
                        <div className="comments">
                            <span>{comments.filter(comment => comment.postId === post._id).length} comments</span>
                        </div>
                    </div>
                    <hr />
                    {comments ? (
                        comments.map(comment => (
                            comment.postId === post._id ? <Comment friendId={null} key={comments.indexOf(comment)} creatorId={comment.creatorId} username={comment.username} text={comment.text} profile_img={comment.creatorImg}/> : null
                        ))
                    ) : (<span></span>)}
                    <div className="add__comment">
                        <input value={text} onChange={(e) => setText(e.target.value)} type="text" placeholder="Enter your comment" />
                        <button type="button" onClick={() => createComment(post._id)}>Send</button>
                    </div>
                </div>
            </div>
        </article>
    }) : null;
    return (
        <>
            {isFriendsProfile ? allFriendsPosts : null}
            {isStrangersProfile ? strangersAllPosts : userAllPosts}
            {isFriendsProfile ? null : allFriendsPosts}
        </>
    )
}

export default IndexPost;
