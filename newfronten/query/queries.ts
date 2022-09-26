import { gql } from "@apollo/client";

export const REGISTER_QUERY = gql`
    mutation Register($input: NewUser!) {
        register(input: $input)
    }`;

export const LOGIN_QUERY = gql`
    mutation Login($email: String!, $password: String!){
        login(email: $email, password: $password)
    }`;

export const UPDATE_USER = gql`
    mutation UpdateUser($id: String!, $name: String!, $work: String!, $education: String!, $region: String!, $profileURL: String!, $backgroundURL: String!) {
    updateUser(
        id: $id
        name: $name
        work: $work
        education: $education
        region: $region
        profileURL: $profileURL
        backgroundURL: $backgroundURL
    )}`;

export const GET_ACTIVATE_LINK = gql`
    query GetLink($id: String!) {
        getLink(id: $id) {
            id
            userId
    }}`;

export const ACTIVATE_ACC = gql`
    mutation ActivateUser($id: ID!){
        activateUser(id: $id)
    }`;

export const CREATE_LINK = gql`
  mutation CreateResetLink($userEmail:String!){
    createResetLink(userEmail:$userEmail)
}`;

export const UPDATE_PASS = gql`
  mutation UpdatePassword($id:String!, $newPassword:String!){
    updatePassword(id:$id, newPassword:$newPassword)
}`;
export const SEARCH = gql`
  query Search($keyword: String!, $limit: Int!, $offset: Int!){
    search(keyword:$keyword limit:$limit offset:$offset)
}
`
export const CONNECT = gql`
    mutation SendConnect($id: ID!, $requestedId: ID!){
        sendConnect(id: $id, requestedId: $requestedId)
    }`;

export const UNCONNECT = gql`
    mutation Unconnect($id: ID!, $unconnectedId: ID!){
        unconnect(id: $id, unconnectedId: $unconnectedId)
    }`;

export const ACCEPT = gql`
    mutation AcceptConnect($id: ID!, $acceptedId: ID!){
    acceptConnect(id: $id, acceptedId: $acceptedId)
    }`;

export const IGNORE = gql`
    mutation IgnoreConnect($id: ID!, $ignoredId: ID!){
        ignoreConnect(id: $id, ignoredId: $ignoredId)
    }`;

export const REMOVE_REQUEST = gql`
   mutation removedRequest($id:ID!, $removedRequestID:ID!){
   removeRequest(id:$id, removedRequestID:$removedRequestID)
}`;

export const USER = gql`
    query user($id: ID!){
  user(id: $id)
}`

export const FOLLOW = gql`
mutation Follow($id: ID!, $followedId: ID!){
    follow(id: $id, followedId: $followedId)
}`;

export const UNFOLLOW = gql`
mutation Unfollow($id: ID!, $unfollowedId: ID!){
    unfollow(id: $id, unfollowedId: $unfollowedId)
}`;

export const USER_YOU_MIGHT_KNOW = gql`
query UserYouMightKnow($id: ID!){
    userYouMightKnow(id: $id)
}`;

export const CREATE_POST = gql`
    mutation CreatePost($id:ID!, $userId: ID!,  $caption: String!, $photo_url: String, $video_url: String){
        createPost(id: $id, userId: $userId, caption: $caption, photo_url: $photo_url, video_url: $video_url)
}`;

export const LIKE_POST = gql`
    mutation LikePost($id: ID!, $likerId: ID!) {
        likePost(id: $id, likerId: $likerId)
    }`;

export const UNLIKE_POST = gql`
    mutation UnlikePost($id: ID!, $unlikerId: ID!) {
        unlikePost(id: $id, unlikerId: $unlikerId)
    }`;

export const COMMENT_POST = gql`
    mutation CommentPost($postId: ID!, $commenterId: ID!, $comment: String!) {
        commentPost(postId: $postId, commenterId: $commenterId, comment: $comment)
    }`;

export const GENERATE_ID = gql`
    query GenerateID{
        generateID
    }`;

export const GET_POSTS = gql`
    query GetPosts($id: ID!, $limit: Int!, $offset: Int!) {
        getPosts(id: $id, limit: $limit, offset: $offset)
    }`;

export const GET_COMMENTS = gql`
    query GetComments($postId: ID!){
        getComment(postId: $postId)
    }`;

export const LIKE_COMMENT = gql`
    mutation LikeCommentPost($commentId: ID!, $likerId: ID!){
        likeComment(commentId: $commentId, likerId: $likerId)
    }`;

export const UNLIKE_COMMENT = gql`
    mutation UnlikeCommentPost($commentId: ID!, $unlikerId: ID!){
        unlikeComment(commentId: $commentId, unlikerId: $unlikerId)
    }`;

export const CREATE_JOB = gql`
    mutation CreateJobs($id: ID!, $userId: ID!, $title:String!, $company:String!, $position:String!, $description:String!){
    createJobs(id: $id, userId: $userId, title: $title, company:$company, position:$position, description:$description)
    }`;

export const JOBS =gql`
    query GetJobs($limit:Int!, $offset:Int!){
    getJobs(limit: $limit, offset: $offset)
}`;

export const USER_BY_EMAIL=gql`
query UserByEmail($email:String!){
  userByEmail(email:$email)
}`;

export const REGISTER_FOR_GOOGLE=gql`
mutation RegisterForGoogle($id:ID!,$input:NewUser!){
   registerForGoogle(id:$id,input:$input)
}`;

export const GET_RESET_LINK=gql`
query GetResetLink($id:String!){
  getResetLink(id:$id){
    validationCode
    userId
  }
}`;

export const SEARCH_POST=gql`
query Searchpost($keyword:String!, $limit:Int!, $offset:Int!){
  searchpost(keyword:$keyword, limit:$limit, offset:$offset) {
    PhotoURL
    VideoURL
    Caption
    UserID
    ID
  }
}`;

export const SEARCH_CONNECT_USER =gql`
query SearchConnect($id:String!, $keyword:String!, $limit:Int!, $offset:Int!){
  searchConnect(id:$id, keyword:$keyword limit:$limit offset:$offset)
}`;

export const GET_LIMIT_COMMENT = gql`
query GetLimitComment($postId: ID!){
  getLimitComment(postId: $postId)
}`;

export const REPLY_COMMENT = gql`
mutation ReplyComment($postId: ID!, $commenterId: ID!, $comment: String!, $commentId:ID!){
  replyComment(postId: $postId, commenterId:$commenterId, comment: $comment, commentId:$commentId)
}`;

export const GET_REPLY =gql`
query GetReply($commentId:ID!){
   getReply(commentId:$commentId)
}`;

export const VIEW_PROFILE = gql`
mutation ViewUser($id:ID!, $viewedId:ID!){
  viewUser(id:$id, viewedId: $viewedId)
}`;

export const GET_POST_BY_ID =gql`
query GetPost($id:ID!){
  getPost(id:$id)
}`;

export const GET_CONNECT_USERS = gql`
query GetConnectUser($id:ID!){
  getConnectUser(id:$id)
}`;

export const ADD_EXP =gql`
mutation AddExperience($id: ID!, $userId: ID!,$company:String!, $position:String!, $description:String!, $image:String!, $monthStart:Int!, $yearStart:Int!, $monthEnd:Int!, $yearEnd:Int!){
   addExperience(id: $id, 
    userId: $userId, 
    company:$company, 
    position:$position, 
    description:$description, 
    image:$image, 
    monthStart:$monthStart, 
    yearStart:$yearStart, 
    monthEnd:$monthEnd, 
    yearEnd:$yearEnd)
}`;

export const ADD_EDU =gql`
mutation AddEducation($id: ID!, $userId: ID!, $company:String!, $grade:String!, $description:String!, $image:String!, $monthStart:Int!, $yearStart:Int!, $monthEnd:Int!, $yearEnd:Int!){
   addEducation(
    id: $id, 
    userId: $userId, 
    company:$company, 
    grade:$grade, 
    description:$description, 
    image:$image, 
    monthStart:$monthStart, 
    yearStart:$yearStart, 
    monthEnd:$monthEnd, 
    yearEnd:$yearEnd
    )
}`;

export const GET_EXP=gql`
query GetExperience($userId:ID!){
  getExperience(userId:$userId)
}`;

export const GET_EDU=gql`
query GetEducation($userId:ID!){
  getEducation(userId:$userId)
}`;

export const UPDATE_EXP=gql`
mutation UpdateExperience($id: ID!, $userId: ID!, $company:String!, $position:String!, $description:String!, $image:String!, $monthStart:Int!, $yearStart:Int!, $monthEnd:Int!, $yearEnd:Int!){
  updateExperience(
    id: $id, 
    userId: $userId, 
    company:$company, 
    position: $position, 
    description:$description, 
    image:$image, 
    monthStart:$monthStart, 
    yearStart:$yearStart, 
    monthEnd:$monthEnd, 
    yearEnd:$yearEnd)
}`

export const DEL_EXP=gql`
mutation DeleteExperience($id:ID!, $userId:ID!){
  deleteExperience(id:$id, userId:$userId)
}`

export const UPDATE_EDU=gql`
mutation UpdateEducation($id: ID!, $userId: ID!, $company:String!, $grade:String!, $description:String!, $image:String!, $monthStart:Int!, $yearStart:Int!, $monthEnd:Int!, $yearEnd:Int!){
  updateEducation(
    id: $id, 
    userId: $userId, 
    company:$company, 
    grade: $grade, 
    description:$description, 
    image:$image, 
    monthStart:$monthStart, 
    yearStart:$yearStart, 
    monthEnd:$monthEnd, 
    yearEnd:$yearEnd)
}`

export const DEL_EDU=gql`
mutation DeleteEducation($id:ID!,$userId:ID!){
  deleteEducation(id:$id,  userId:$userId)
}`

export const BLOCK_USER=gql`
mutation BlockUser($id:ID!, $blockedId:ID!){
  blockUser(id:$id, blockedId:$blockedId)
}`;
