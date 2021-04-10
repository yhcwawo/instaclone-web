import { gql, useQuery } from "@apollo/client";
import Photo from "../components/feed/Photo";

const FEED_QUERY = gql`
  query seeFeed($offset: Int!) {
    seeFeed(offset: $offset){
      id
      file
      likes
      comments
      isLike

      user{
          id
          username
          avatar
      }
      caption

      createdAt
      isMine
      }
 }
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
      {data?.seeFeed?.map((photo : any) => (
       <Photo key={photo.id} {...photo} />
      ))}
    </div>
  );
}
export default Home;
