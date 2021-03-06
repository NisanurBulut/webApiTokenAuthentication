import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { AuthContext } from '../context/auth';
import { Card, Icon, Label, Image, Button } from 'semantic-ui-react';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';

function PostCard({
  bookPost: {
    name,
    author,
    createdAt,
    id,
    user,
    likeCount,
    commentCount,
    likes,
  },
}) {

  const { localUser } = useContext(AuthContext);
  const header =
    (localUser && localUser.username === user.username) === true ? (
      <DeleteButton key={id} postId={id} />
    ) : (
      <Icon
      key={id}
      size="large"
      name=""
    />
    );

  return (
    <Card fluid>
      <Card.Content header={header}></Card.Content>
      <Card.Content>
        <Image floated="right" size="mini" src={user.imageUrl} />
        <Card.Header>{user.username}</Card.Header>
        <Card.Meta as={Link} to={`/bookposts/${id}`}>
          {moment(createdAt).fromNow(true)}
        </Card.Meta>
        <Card.Description>
          {name}-{author}
        </Card.Description>
      </Card.Content>
      <Card.Content extra >
        <LikeButton
          user={localUser}
          id={id}
          likes={likes}
          likeCount={likeCount}
        />
        <Button
          floated="right"
          size="mini"
          as="div"
          labelPosition="right"
          as={Link}
          to={`/bookposts/${id}`}
        >
          <Button size="mini" color="blue">
            <Icon name="comments" />
          </Button>
          <Label basic color="blue" pointing="left">
            {commentCount}
          </Label>
        </Button>
      </Card.Content>
    </Card>
  );
}

export default PostCard;
