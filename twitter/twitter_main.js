document.addEventListener("DOMContentLoaded", function(){
    
    //  처음 페이지 로드 때, 로드를 한다.
    if(scrollLoad.checkScroll()){
        async.loadpost();
//        timeline.init();
    }

    //  document가 스크롤 될 때, 남은 스크롤 확인 및, 로드 여부 결정
    document.addEventListener("scroll", function(){
        if(scrollLoad.checkScroll()){
            async.loadpost();
        }
    });
    
    console.log("loaded");
    
    var posttxt = document.querySelector(".posttxt");

    var isActive = false;
    var alreadymake = false;

    posttxt.addEventListener("focus", function(e){
        isActive = true
        if(!alreadymake){
            var postTab = e.currentTarget.parentNode.parentNode;
            postTab.classList.add("postFocused");

            var postbox = document.createElement("div");
            postbox.classList.add("postbox");
            var postbutton = document.createElement("button");
            postbutton.setAttribute("type", "submit")
            postbutton.textContent = "Tweet";
            postbutton.classList.add("postbtn");
            var checkbyte = document.createElement("span");
            checkbyte.textContent = "300";
            postbox.appendChild(checkbyte);
            postbox.appendChild(postbutton);
            postTab.appendChild(postbox);
        }
        alreadymake = true;
        
        posttxt.addEventListener("keydown", function(e){
            var postTab = e.currentTarget.parentNode.parentNode;
            var checkchar = postTab.querySelector("span");
            var result = postboxfunc.checkbyte(posttxt);
            checkchar.textContent = result;
            
            if(result <300){
                document.querySelector(".postbtn").classList.add("active");
            }else{
                document.querySelector(".postbtn").classList.remove("active");
            }
        });
    });
    
    
    document.addEventListener("click", function(e){
        console.log(e.target);
        isActive = false
        
        var postbtn = document.querySelector(".active");
        if(e.target === postbtn){
            console.log("post");
            async.sendpost();
            return;
        }
        
        if(e.target.classList.contains("activeFav")){
            e.target.classList.remove("activeFav");
            var targetid =
                e.target.parentElement.parentElement.parentElement.querySelector(".userTag");
            var target = e.target.parentElement.children[5].textContent;
            console.log(target);
            target = eval(target)-1;
            e.target.parentElement.children[5].textContent = target;
            async.unfavorite(targetid.textContent);
            return;
        }
        
        if(e.target.classList.contains("fa-star") && !e.target.classList.contains("activeFav")){
            
            e.target.classList.add("activeFav");
            var targetid =
                e.target.parentElement.parentElement.parentElement.querySelector(".userTag");
            var target = e.target.parentElement.children[5].textContent;
            console.log(target);
            target = eval(target)+1;
            e.target.parentElement.children[5].textContent = target;
            async.favorite(targetid.textContent);
            return;
        }


        if(e.target.classList.contains("active")){
            isActive = true;
        }
        if(e.target.classList.contains("posttxt")){
            isActive = true;
        }
        
        var postTab = document.querySelector(".postFocused")
        
        if(!isActive){
            console.log(postTab);
            isActive = false;
            alreadymake = false;
            postTab.querySelector(".postbox").remove();
            postTab.classList.remove("postFocused");
        };
    });

    
})


var postboxfunc = {
    checkbyte : function(element){
        var char = element.value.length;
        return 299-char;
    }
}

var content = {
    makeContent : function(item){
            
        var userId = document.createElement("li");
        userId.classList.add("userId");
        userId.textContent = item.username;
        var userTag = document.createElement("li");
        userTag.classList.add("userTag");
        userTag.textContent = item.id;
        var posttime = document.createElement("li");
        posttime.classList.add("posttime");
        posttime.textContent = item.regdate;
        var contentTxt = document.createElement("li");
        contentTxt.classList.add("contentTxt");
        contentTxt.textContent = item.content;
        
        var contentInfo = document.createElement("ul");
        contentInfo.classList.add("contentInfo");
        
        contentInfo.appendChild(userId);
        contentInfo.appendChild(userTag);
        contentInfo.appendChild(posttime);
        contentInfo.appendChild(contentTxt);
        
        var share = document.createElement("li");
        share.classList.add("share");
        var sicon = document.createElement("i");
        sicon.classList.add("fa");
        sicon.classList.add("fa-share");
        
        
        var retweet = document.createElement("li");
        retweet.classList.add("retweet");
        
        var reticon = document.createElement("i");
        reticon.classList.add("fa");
        reticon.classList.add("fa-retweet");
        
        retweet.textContent = item.retweet;
        
        var favorite = document.createElement("li");
        favorite.classList.add("favorite");
        var favicon = document.createElement("i");
        favicon.classList.add("fa");
        favicon.classList.add("fa-star");
        
        favorite.textContent = item.favorite;
        
        var interactive = document.createElement("ul");
        interactive.classList.add("interactive");
        
        interactive.appendChild(sicon);
        interactive.appendChild(share);
        interactive.appendChild(reticon);
        interactive.appendChild(retweet);
        interactive.appendChild(favicon);
        interactive.appendChild(favorite);
        
        var profileImg = document.createElement("img");
        profileImg.setAttribute("src", "http://cdn.playbuzz.com/cdn/21ab7243-0380-420f-914c-63d4ce59aa3c/bf1bfae7-1163-4f90-a3b0-4ce677e91f1d.jpg")
        profileImg.classList.add("userPic");
        
        var contentbox = document.createElement("div");
        contentbox.classList.add("content");
        
        contentbox.appendChild(profileImg);
        contentbox.appendChild(contentInfo);
        contentbox.appendChild(interactive);
        
        return contentbox;
    }
}

async = {
    index : 1,
    curFile : function(){
        var filesrc = "http://api.taegon.kim/posts/page/" + this.index;
        return filesrc;
    },
    loadpost : function(){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', this.curFile(), true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState==4 && xhr.status==200){
                callback(xhr.responseText);
                async.index++;
            };
        }
        xhr.send(null);
    },
    
    sendpost : function(){
        var xhr = new XMLHttpRequest();
        var contentsend = document.querySelector(".posttxt").value;
        var item = 
            {"id":"404",
             "content": contentsend,
             "retweet":1,
             "favorite":18,
             "regdate":new Date,
             "username":"황종성"
            }
        xhr.open('POST', "http://api.taegon.kim/posts", true);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
        xhr.onreadystatechange = function() {
            if (this.readyState == 4){
                console.log(JSON.stringify(item));
            }
        }
        xhr.send(JSON.stringify(item));
    },
    
    favorite : function(num){
        
        var src = "http://api.taegon.kim/posts/" + num +"/favorite";
        var xhr = new XMLHttpRequest();

        console.log(src);
        xhr.open('POST', src, true);
        xhr.onreadystatechange = function() {
            if(this.readyState == 4) {
                var data = JSON.parse(xhr.responseText);
                console.log(data.post.favorite);
            }
        }
        xhr.send();
    },
    
    unfavorite : function(num){
        
        var src = "http://api.taegon.kim/posts/" + num +"/favorite";
        var xhr = new XMLHttpRequest();
        
        console.log(src);
        xhr.open('DELETE', src, true);
        
        xhr.onreadystatechange = function() {
            if(this.readyState == 4) {
                var data = JSON.parse(xhr.responseText);
                console.log(data.post.favorite);
            }
        }
        xhr.send();
    }
    
    
};




var scrollLoad = {
    viewportHeight  : window.innerHeight,
    bodyHeight      : document.getElementsByTagName("body").scrollHeight,
    bodyScrollToTop : document.getElementsByTagName("body").scrollTop,
    scrollToBottom  : this.bodyHeight - (this.bodyScrollToTop + this.viewportHeight),

    loadByScroll : function(){
        console.log("load div");
        var timeline = document.querySelector("main");
    },

    checkScroll : function(){
        var body = document.querySelector("body");

        this.viewportHeight     = window.innerHeight;
        this.bodyHeight         = body.scrollHeight;
        this.bodyScrollToTop    = body.scrollTop;
        this.scrollToBottom     = this.bodyHeight - (this.bodyScrollToTop + this.viewportHeight);

        if(this.scrollToBottom < this.viewportHeight){
            console.log("remain : " +this.scrollToBottom);
            return true;
        }else{
            return false;
        }
    },
};

callback = function(xhrresponseText){

    var data = JSON.parse(xhrresponseText);
    if(data.posts.length === 0){
        console.log("NO MORE JSON FILE");
        return;
    }

    for(var i = 0, item; item = data.posts[i]; i++){
        var dom = content.makeContent(item);
        document.querySelector(".timeline").appendChild(dom);
    }
};
