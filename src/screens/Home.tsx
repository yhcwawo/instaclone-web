import { gql, useQuery } from "@apollo/client";
import Photo from "../components/feed/Photo";
import PageTitle from "../components/PageTitle";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../fragments";

const FEED_QUERY = gql`
  query seeFeed($offset: Int!) {
    seeFeed(offset: $offset){
        ...PhotoFragment
        user {
          username
          avatar
        }
        caption

        comments {
          ...CommentFragment
        }
        
        createdAt
        isMine
        
      }
    }
    ${PHOTO_FRAGMENT}
    ${COMMENT_FRAGMENT}
`;

function Home() {
  const { data = {} ,error, loading } = useQuery(FEED_QUERY, {
    variables: {
        offset: 0,
    },
});

//console.log(JSON.stringify(error, null, 2));

  return (
    <div>
      <PageTitle title="Home" />
      {data?.seeFeed?.map((photo : any) => (
       <Photo key={photo.id} {...photo} />
      ))}
    </div>
  );
}
export default Home;
