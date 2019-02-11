# Web API
## addImage
1. Description: 
    This method is to stored a new inserted image from frontend to backend database.

2. Request:
    - Method: `POST`
    - Url: `/api/images/`
    - Request body  (JSON object): `{"title":"deer","author":"Me","picture":{"fieldname":"picture","originalname":"IMG_7323.JPG","encoding":"7bit","mimetype":"image/jpeg","destination":"/Users/huangwanjing/Desktop/CSCC09/course_work/hw2-hwj0418/webgallery/uploads/","filename":"8c41a5d267767248ab95ee535dd7c290","path":"/Users/huangwanjing/Desktop/CSCC09/course_work/hw2-hwj0418/webgallery/uploads/8c41a5d267767248ab95ee535dd7c290","size":57627}`

3. Response(s):
    - Status code: `200`
    - Header: `Content-Type: application/json`
    - Body (JSON object): `{"title":"deer","author":"ewq","picture":{"fieldname":"picture","originalname":"IMG_7323.JPG","encoding":"7bit","mimetype":"image/jpeg","destination":"/Users/huangwanjing/Desktop/CSCC09/course_work/hw2-hwj0418/webgallery/uploads/","filename":"c3efa4e8d6fd03b47fcbfcabad6567de","path":"/Users/huangwanjing/Desktop/CSCC09/course_work/hw2-hwj0418/webgallery/uploads/c3efa4e8d6fd03b47fcbfcabad6567de","size":57627},"_id":"E2hfPMA0dRlEa606","createdAt":"2019-02-09T23:08:47.411Z","updatedAt":"2019-02-09T23:08:47.411Z"}`

4. Example:
    curl --request POST --header 'Content-Type: application/json' --data '{"title":"deer","author":"Me","picture":{"fieldname":"picture","originalname":"IMG_7323.JPG","encoding":"7bit","mimetype":"image/jpeg","destination":"/Users/huangwanjing/Desktop/CSCC09/course_work/hw2-hwj0418/webgallery/uploads/","filename":"8c41a5d267767248ab95ee535dd7c290","path":"/Users/huangwanjing/Desktop/CSCC09/course_work/hw2-hwj0418/webgallery/uploads/8c41a5d267767248ab95ee535dd7c290","size":57627}' http://localhost:3000/api/images/

## addComment
1. Description: 
    This method is called when user wants to add a new comment to a existen image.

2. Request:
    - Method: `POST`
    - Url: `/api/comments/`
    - Request body (JSON object): '{"imageId": "E2hfPMA0dRlEa606", "author: 1", "content":"hi"}'

3. Response(s):
    - Status code: `200`
    - Header: `Content-Type: application/json`
    - Body (JSON object): '{"imageId":"E2hfPMA0dRlEa606","author":"2","content":"sdfb","_id":"mEp9kTga3SRzNBDJ","createdAt":{"$$date":1549755698536},"updatedAt":{"$$date":1549755698536}}'


4. Example:
    curl --header "Content-Type: application/json" \
    --request POST \
    --data '{"imageId": "E2hfPMA0dRlEa606", "author: 3", "content":"hi"}' \
    http://localhost:3000/api/comments/

## deleteImage

1. Description: 
    This method is called when user wants to delete an existen image. It communicate with and modified backend database.

2. Request:
    - Method: `DELETE`
    - Url: `/api/images/:imageId/`
    - Request body (JSON object): '{}'

3. Response(s):
    - Status code: `200`
    - Header: `Content-Type: application/json`
    - Body (JSON object): '{}'


4. Example:
    curl --header "Content-Type: application/json" \
    --request DELETE \
    --data '{}' \
    http://localhost:3000/api/images/:E2hfPMA0dRlEa606/

## deleteComments

1. Description: 
    This method is called when user wants to delete an existen comment. It communicate with and modified backend database.

2. Request:
    - Method: `DELETE`
    - Url: `/api/comments/:commentId/`
    - Request body (JSON object): '{}'

3. Response(s):
    - Status code: `200`
    - Header: `Content-Type: application/json`
    - Body (JSON object): '{}'


4. Example:
    curl --header "Content-Type: application/json" \
    --request DELETE \
    --data '{}' \
    http://localhost:3000/api/comments/:"ahkNdP9rwhTIzQeE"/

## olderComment

1. Description: 
    This method is called when user wants to see the older 10 comments

2. Request:
    - Method: `GET`
    - Url: `/api/comments/:imageId/:page/:action/`
    - Request body (JSON object): '{}'

3. Response(s):
    - Status code: `200`
    - Header: `Content-Type: application/json`
    - Body (JSON object): '{}'


4. Example:
    curl --header "Content-Type: application/json" \
    --request GET \
    --data '{}' \
    http://localhost:3000/api/comments/E2hfPMA0dRlEa606/0/older/

## laterComment

1. Description: 
    This method is called when user wants to see the later 10 comments

2. Request:
    - Method: `GET`
    - Url: `/api/comments/:imageId/:page/:action/`
    - Request body (JSON object): '{}'

3. Response(s):
    - Status code: `200`
    - Header: `Content-Type: application/json`
    - Body (JSON object): '{}'


4. Example:
    curl --header "Content-Type: application/json" \
    --request GET \
    --data '{}' \
    http://localhost:3000/api/comments/E2hfPMA0dRlEa606/0/later/

## previousImage

1. Description: 
    This method is called when user wants to see the previous added image

2. Request:
    - Method: `GET`
    - Url: `/api/images/:imageId/:action/`
    - Request body (JSON object): '{}'

3. Response(s):
    - Status code: `200`
    - Header: `Content-Type: application/json`
    - Body (JSON object): '{}'


4. Example:
    curl --header "Content-Type: application/json" \
    --request GET \
    --data '{}' \
    http://localhost:3000/api/images/E2hfPMA0dRlEa606/previous/

## nextImage

1. Description: 
    This method is called when user wants to see the later added image

2. Request:
    - Method: `GET`
    - Url: `/api/images/:imageId/:action/`
    - Request body (JSON object): '{}'

3. Response(s):
    - Status code: `200`
    - Header: `Content-Type: application/json`
    - Body (JSON object): '{}'


4. Example:
    curl --header "Content-Type: application/json" \
    --request GET \
    --data '{}' \
    http://localhost:3000/api/images/E2hfPMA0dRlEa606/next/

## onImageUpdate
1. Description: 
    This method is called by the front end each time the user refresh the page, it will return the latest modified image object with its comments

2. Request:
    - Method: `GET`
    - Url: `/api/images/:imageId/`
    - Request body (JSON object): '{}'

3. Response(s):
    - Status code: `200`
    - Header: `Content-Type: application/json`
    - Body (JSON object): '{ title: 'deer',
        author: 'ewq',
        picture:
        { fieldname: 'picture',
            originalname: 'IMG_7323.JPG',
            encoding: '7bit',
            mimetype: 'image/jpeg',
            destination:
            '/Users/huangwanjing/Desktop/CSCC09/course_work/hw2-hwj0418/webgallery/uploads/',
            filename: 'c3efa4e8d6fd03b47fcbfcabad6567de',
            path:
            '/Users/huangwanjing/Desktop/CSCC09/course_work/hw2-hwj0418/webgallery/uploads/c3efa4e8d6fd03b47fcbfcabad6567de',
            size: 57627 },
        _id: 'E2hfPMA0dRlEa606',
        createdAt: 2019-02-09T23:08:47.411Z,
        updatedAt: 2019-02-09T23:08:47.411Z }'


4. Example:
    curl --header "Content-Type: application/json" \
    --request GET \
    --data '{}' \
    http://localhost:3000/api/images/E2hfPMA0dRlEa606/

## onCommentUpdate
1. Description: 
    This method is called by the front end each time the user refresh the page, it will return the latest modified image object's comments

2. Request:
    - Method: `GET`
    - Url: `/api/comments/:imageId/`
    - Request body (JSON object): '{}'

3. Response(s):
    - Status code: `200`
    - Header: `Content-Type: application/json`
    - Body (JSON object): `[{"imageId":"E2hfPMA0dRlEa606","author":"1","content":"qwe","_id":"ahkNdP9rwhTIzQeE","createdAt":"2019-02-09T23:39:01.990Z","updatedAt":"2019-02-09T23:39:01.990Z"},{"imageId":"E2hfPMA0dRlEa606","author":"2","content":"sdfb","_id":"mEp9kTga3SRzNBDJ","createdAt":"2019-02-09T23:41:38.536Z","updatedAt":"2019-02-09T23:41:38.536Z"}]`


4. Example:
    curl --header "Content-Type: application/json" \
    --request GET \
    --data '{}' \
    http://localhost:3000/api/comments/E2hfPMA0dRlEa606/
