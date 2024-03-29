import React, { useRef, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import styles from "../../styles/CreateEditPostForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { axiosReq } from "../../api/axiosDefaults";
import { useRedirect } from "../../hooks/useRedirect";
import { useActiveUser } from "../../contexts/ActiveUserContext";

function CreatePostForm() {
  // Redirect unauthenticated users
  useRedirect("loggedOut");
  const activeUser = useActiveUser();
  // Error state for form validation feedback
  const [errors, setErrors] = useState({});

  // State for handling post data
  const [postInfo, setPostInfo] = useState({
    title: "",
    post_content: "",
    image: "",
  });

  // Destructuring post data
  const { title, post_content, image } = postInfo;

  // useRef hook for handling the image input
  const imageInput = useRef(null);

  // useHistory hook for redirecting a user after form submission
  const history = useHistory(null);

  // Event handler to handle changes in form fields and update the state
  const handleChange = (event) => {
    setPostInfo({
      ...postInfo,
      [event.target.name]: event.target.value,
    });
  };

  // Event handler to handle image changes and update the state
  const handleImageChange = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);
      setPostInfo({
        ...postInfo,
        image: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  // Event handler to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    // Appends text fields to formData
    formData.append("title", title);
    formData.append("post_content", post_content);

    // If an image file is selected, append it to formData
    if (imageInput.current && imageInput.current.files[0]) {
      formData.append("image", imageInput.current.files[0]);
    }

    try {
      // Check for duplicate titles by fetching existing posts
      const { data: existingPosts } = await axiosReq.get(
        `/posts/?owner=${activeUser?.username}`
      );
      const isDuplicate = existingPosts.results.some(
        (post) => post.title.toLowerCase() === title.trim().toLowerCase()
      );
      if (isDuplicate) {
        setErrors({ title: ["You already have an existing post with the same title."] });
      } else {
        // If not duplicate, post the new post data
        const { data } = await axiosReq.post("/posts/", formData);
        // Redirect user to the newly created post
        history.push(`/posts/${data.id}`);
      }
    } catch (err) {
      console.log(err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  // Render the CreatePostForm in the browser
  return (
    <Form className={styles.Input} onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
          <Container
            className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
          >
            {/* Post title input */}
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter post title"
                className={styles.PlaceholderFontSize}
                name="title"
                value={title}
                onChange={handleChange}
              />
            </Form.Group>
            {/* Error display for title */}
            {errors?.title?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
            {/* Post content input */}
            <Form.Group controlId="post_content">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter post description"
                className={styles.PlaceholderFontSize}
                name="post_content"
                value={post_content}
                onChange={handleChange}
              />
            </Form.Group>
            {/* Error display for post content */}
            {errors?.post_content?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
            {/* Image upload input */}
            <Form.Group>
              <Form.File
                id="image-upload"
                label="Upload Image"
                accept="image/*"
                onChange={handleImageChange}
                ref={imageInput}
              />
              {/* Show image preview when uploading an image file */}
              {image && (
                <div className="mt-3">
                  <img src={image} alt="Preview" style={{ maxWidth: "100%", height: "auto" }} />
                </div>
              )}
            </Form.Group>
            {/* Error display for image */}
            {errors?.image?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
          </Container>
        </Col>
        <Col className="p-0 p-md-2 d-md-block" md={5} lg={4}> 
          <Container
            className={`${appStyles.Content} d-flex justify-content-center align-items-center`}
          >
            {/* Cancel button */}
            <Button
              className={`${btnStyles.Button} ${btnStyles.Blue} ${styles.ButtonArea}`}
              onClick={() => history.goBack()}
            >
              Cancel
            </Button>

            {/* Submit button */}
            <Button
              className={`${btnStyles.Button} ${btnStyles.Blue} ${styles.ButtonArea}`}
              type="submit"
            >
              Create
            </Button>
          </Container>
        </Col>
      </Row>
    </Form>
  );
}

export default CreatePostForm;