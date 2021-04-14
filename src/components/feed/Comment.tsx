import React from "react";
import { gql, useMutation } from "@apollo/client";
import PropTypes from "prop-types";
import styled from "styled-components";
import { FatText } from "../shared";
import { Link } from "react-router-dom";

const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($id: Int!){
      deleteComment(id:$id){
        ok
        error
      }
    }
`;

const CommentContainer = styled.div`
  margin-bottom: 7px;
`;
const CommentCaption = styled.span`
  margin-left: 10px;
  a {
    background-color: inherit;
    color: ${(props) => props.theme.accent};
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

function Comment({id, isMine, author, payload, photoId } : any) {
  const updateDeleteComment = (cache :any, result :any) => {
    const {
      data: {
        deleteComment: {ok},
      },
    } = result;
    if(ok){
      cache.evict({id: `Comment:${id}`});
      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          commentNumber(prev : any){
            return prev - 1;
          },
        },
      });
    }

  }
  const [deleteCommentMutation] = useMutation(DELETE_COMMENT_MUTATION, {
    variables: {
      id,
    },
    update: updateDeleteComment,
  });

  const onDeleteClick = () => {
    deleteCommentMutation();
  }

  return (
    <CommentContainer>
      <Link to={`/users/${author}`}>
        <FatText>{author}</FatText>
      </Link>
      <CommentCaption>
        {payload.split(" ").map((word : any, index : any)  =>
          /#[\w]+/.test(word) ? (
            <React.Fragment key={index}>
              <Link to={`/hashtags/${word}`}>{word}</Link>{" "}
            </React.Fragment>
          ) : (
            <React.Fragment key={index}>{word} </React.Fragment>
          )
        )}
      </CommentCaption>
      {isMine ? <button onClick={onDeleteClick}>X</button> : null}
    </CommentContainer>
  );
}

Comment.propTypes = {
  author: PropTypes.string.isRequired,
  payload: PropTypes.string.isRequired,
  id: PropTypes.number,
  isMine: PropTypes.bool,
  photoId: PropTypes.number,
};

export default Comment;