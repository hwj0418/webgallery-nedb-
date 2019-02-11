/*jshint esversion: 6 */
(function(){
  "use strict";
  api.onImageUpdate(function(img){
    document.querySelector("#post").innerHTML = '';
    if(!img){//gallery currently empty
      //display welcome message
      document.querySelector("#welcome_message").style.display = "flex";
      //document.querySelector("#comment_form").classList.add("hidden");
      document.querySelector("#switch_comment_btns").classList.add("hidden");
    }
    else{//display img
      let elmt = document.createElement('div');
      elmt.innerHTML=`
      <div id="new_post" class="btn_display">
          <button id="delete_img_btn" class="btn">Delete Image</button>
      </div>
      <div class="switch_img">
        <div id="prev_img_btn" class="left_icon icon"></div>
        <img id = "display_image" class="post_img" src="/api/images/${img._id}/profile/picture/" alt="${img._id}">
        <div id="next_img_btn" class="right_icon icon"></div>
      </div>
      <div class="post_title">${img.title}</div>
      <div class="post_author">By: ${img.author} on ${img.createdAt}</div> 
      <form id="comment_form" class="complex_form">
      <input maxlength="10" id="comment_author" type="text" class="form_element" placeholder="Enter your name" name="title" required/>
      <textarea maxlength="500" rows="5" id="comment_content" type="text" class="form_element" placeholder="Comment this image" name="title" required/></textarea>
      <div class="btn_display" >
          <button id="post_comment" class="btn" type="submit">Post comment</button>
      </div>
      </form>
      `;
      document.getElementById("post").prepend(elmt);
      //display img's comments
      //add listener to all icons
      elmt.querySelector("#delete_img_btn").addEventListener('click', function(e){
        e.preventDefault();
        api.deleteImage(img._id);
      });
      elmt.querySelector("#prev_img_btn").addEventListener('click', function(e){
        e.preventDefault();
        api.previousImage(img._id);
      });
      elmt.querySelector("#next_img_btn").addEventListener('click', function(e){
        api.nextImage(img._id);
      });
      document.querySelector("#comment_form").addEventListener('submit', function(e){
        e.preventDefault();
        console.log("add comments");
        let comment_author = elmt.querySelector("#comment_author").value;
        let comment_content = elmt.querySelector("#comment_content").value;
        api.addComment(img._id, comment_author, comment_content);
      });
    }
  });

  api.onCommentUpdate(function(imageId, comments, page){
    //console.log("index onCommentUpdate,comments and page are:", comments, page);
    document.querySelector("#comments").innerHTML = '';
    if(comments.length > 0){
      comments.forEach(function(comment){
        let elmt = document.createElement('div');
        elmt.innerHTML=`
        <div class="comments">
          <div class="author">
            <div class="comment_author">${comment.author}: </div>
            <div class="comment_date">${comment.createdAt}</div>
          </div>
          <div class="comment_content">${comment.content}</div>
          <div id = "delete_comment_btn" class="delete_icon icon"></div>
        </div>
        `;
        document.getElementById("comments").prepend(elmt);
        elmt.querySelector("#delete_comment_btn").addEventListener('click', function(e){
          api.deleteComment(comment._id, page, imageId);
        });
      });
      document.querySelector("#switch_comment_btns").classList.remove("hidden");
      document.querySelector("#later_comment_btn").addEventListener('click', function(e){
        e.preventDefault();
        if(page > 0){
          console.log("switch to later comment with page and imgId:", page, imageId);
          api.laterComment(imageId, page); 
        }
      });
      document.querySelector("#older_comment_btn").addEventListener('click', function(e){
        e.preventDefault();
        console.log("switch to older comment with page:",page);
        api.olderComment(imageId, page);
      });
    }else{document.querySelector("#switch_comment_btns").classList.add("hidden");}
  });

  window.onload = function(){
    
    document.querySelector('#new_img_form').addEventListener('submit', function(e){
      document.querySelector("#welcome_message").style.display = "none";
      document.querySelector("#new_img_form").style.display = "none";
      // prevent from refreshing the page on submit
      e.preventDefault();
      // read form elements
      let img_title = document.querySelector("#img_title").value;
      let img_file = document.querySelector("#picture").files[0];
      let img_author = document.querySelector("#img_author").value;
      // clean form
      document.getElementById("new_img_form").reset();
      //console.log("index 18, got img info, pass to api add img", img_file);
      api.addImage(img_title, img_author, img_file);
    });
    document.querySelector('#new_post_btn').addEventListener('click',function(){
      let toggle = document.querySelector("#new_img_form");
      if(toggle.style.display === "none") toggle.style.display = "flex";
      else{toggle.style.display = "none"}
    });

  }//end window onload

}());