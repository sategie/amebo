import React from 'react'
import { Card, Media, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { axiosRes } from '../../api/axiosDefaults';
import Avatar from '../../components/Avatar';
import { useActiveUser } from '../../contexts/ActiveUserContext';
import appStyles from '../../App.module.css';
import styles from '../../styles/Post.module.css';
import { DropdownOption } from '../../components/DropdownOption';

const Post = (props) => {
    const {
        id,
        profile_id,
        profile_image,
        comments_count,
        likes_count,
        like_id,
        title,
        post_content,
        image,
        updated_date,
        user,
        postPage,
        setPosts
    } = props;

    const activeUser = useActiveUser();

    const is_own_post = activeUser?.username === user;

    const history = useHistory();

    const handleEdit = () => {
        history.push(`/posts/${id}/edit`);
    };

    const handleDelete = async () => {
        try {
          await axiosRes.delete(`/posts/${id}/`);
          history.goBack();
        } catch (err) {
          console.log(err);
        }
      };

    const handleLike = async() => {
        try{
            const {data} = await axiosRes.post("/likes/", {
                post: id});
            setPosts((prevPosts) => ({
                ...prevPosts,
                results: prevPosts.results.map((post) => {
                    return post.id === id
                    ? {...post, likes_count: post.likes_count +1, like_id: data.id}
                    : post;
                }),
            }));
        } catch (err) {
            console.log(err);
        }
    };

    const handleUnlike = async () => {
        try {
          await axiosRes.delete(`/likes/${like_id}/`);
          setPosts((prevPosts) => ({
            ...prevPosts,
            results: prevPosts.results.map((post) => {
              return post.id === id
                ? { ...post, likes_count: post.likes_count - 1, like_id: null }
                : post;
            }),
          }));
        } catch (err) {
          console.log(err);
        }
      }


  return (
    <Card className={styles.Post}>
        <Card.Body>
            <Media className="align-items-center justify-content-between">
                <Link to={`/profiles/${profile_id}`}>
                    <Avatar src={profile_image} height={45} />
                    {user}
                </Link>
                <div className="d-flex align-items-center">
                    <span>{updated_date}</span>
                    {is_own_post && postPage && <DropdownOption handleEdit={handleEdit} handleDelete={handleDelete} />}
                </div>
            </Media>
        </Card.Body>

        <Link to={`/posts/${id}`}>
            {title && <Card.Title className={styles.LargeTitle}>{title}</Card.Title>}
            {post_content && <Card.Text>{post_content}</Card.Text>}
            <Card.Img src={image} alt={title} className={appStyles.Image} />
        </Link>
        
        <hr className={styles.ContentBorder} />
        
        <Card.Body>
            <div className={styles.PostBar}>
                {is_own_post ? (
                    <OverlayTrigger
                        placement="left"
                        overlay={<Tooltip className={appStyles.TooltipSize}>Sorry, you cannot like your own post!</Tooltip>}
                    >
                        <i className="far fa-heart" />
                    </OverlayTrigger>
                ) : like_id ? (
                    <span onClick={handleUnlike}>
                        <i className={`fas fa-heart ${styles.Heart}`} />
                    </span>
                ) : activeUser ? (
                    <span onClick={handleLike}>
                        <i className={`far fa-heart ${styles.HeartOutline}`} />
                    </span>
                ) : (
                    <OverlayTrigger
                        placement="left"
                        overlay={<Tooltip className={appStyles.TooltipSize}>You need to log in to like posts!</Tooltip>}
                    >
                        <i className="far fa-heart" />
                    </OverlayTrigger>
                )}
                {likes_count}
                <Link to={`/posts/${id}`}>
                    <i className="far fa-comments" />
                    {comments_count}
                </Link>
            </div>
        </Card.Body>
    </Card>
  )
}

export default Post