document.addEventListener("DOMContentLoaded", function(){

//  처음 페이지 로드 때, JSON file 로드를 한다.
    if(scrollLoad.checkScroll()){
        async.loadJSON();
        timeline.init();
    }
    
//  document가 스크롤 될 때, 남은 스크롤 확인 및, 로드 여부 결정
    document.addEventListener("scroll", function(){
        if(scrollLoad.checkScroll()){
            async.loadJSON();
            timeline.init();
        }
    });

//  alt + 's' 키 입력시 검색창에 focus
    document.addEventListener("keyup", function(e){
        console.log(e.keyCode);
        var search = document.querySelector(".searchText");
        console.log(search);
        if(e.altKey === true && e.keyCode === 83){
            console.log("focused");
            search.focus();
        }
        
//      j를 눌렀을 때
        if(e.keyCode === 74){
            var curdiv = timeline.getTimeline();
            console.log(curdiv);
            curdiv.focus();
            if(timeline.index > 0){
                timeline.index--;
            }
        }
        
//      k를 눌렀을 때        
        if(e.keyCode === 75){
            var curdiv = timeline.getTimeline();
            console.log(curdiv);
            curdiv.focus();
            if(timeline.index < timeline.arrayTimeline.length){
                timeline.index++;
            }
        }
    });

//  main에 click 이벤트를 걸어, 이벤트 위임을 한다.
    document.querySelector("main").addEventListener("click", function(e){
        
//      e.target이 like 버튼일 때, 버튼을 푸르딩딩하게 바꾼다.
        if(e.target.classList.contains("likeBtn")){
            if(e.target.classList.contains("blue")){
                e.target.classList.toggle("blue");
                var showLike = e.target.parentNode.parentNode.querySelector(".showLike")
                console.log(showLike);
                var targetLike = parseInt(showLike.getAttribute("data-like"));
                showLike.setAttribute("data-like", targetLike-1);
                showLike.textContent = "좋아요 " + showLike.getAttribute("data-like") +"개";
            }else{
                e.target.classList.toggle("blue");
                var showLike = e.target.parentNode.parentNode.querySelector(".showLike")
                console.log(showLike);
                var targetLike = parseInt(showLike.getAttribute("data-like"));
                showLike.setAttribute("data-like", targetLike+1);
                showLike.textContent = "좋아요 " + showLike.getAttribute("data-like") +"개";
            }
        }
    });
});


var timeline = {
    arrayTimeline : [],
    index : 0,
    init : function(){
        this.arrayTimeline = document.querySelectorAll(".outer");
        console.log(this.arrayTimeline);
        console.log(timeline.arrayTimeline);
    },
    
    getTimeline : function(){
        var timeline = this.arrayTimeline[this.index];
        console.log(this.arrayTimeline)
        console.log(this.index)
        console.log(this.arrayTimeline[this.index])
        console.log(timeline);
        return timeline;
    }.bind(this)
}


var async = {
    index       : 1,
    curFile     : function(){
        var fileDir = "json/page"+this.index+".json";
        return fileDir;
    },
    
    loadJSON    : function(){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', this.curFile(), true);
        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && async.index <= 5){
                var data = JSON.parse(this.responseText);
                for(var i = 0, item; item = data[i]; i++){
                    console.log(item);
                    var dom = scrollLoad.makeDOM(item);
                    document.querySelector("main").appendChild(dom);
                }
                async.index++;
            }else if(async.index > 5){
                console.log("NO MORE JSON FILE");
            }
        };
        xhr.send(null);
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

        timeline.appendChild(this.makeDOM());
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
//};
    
    makeDOM : function(item){
        console.log("makeDOM by item");

        var outer = document.createElement("div");
        outer.classList.add("outer");
        var name = document.createElement("div");
        name.classList.add("name");
        var profile = document.createElement("img");
        profile.src = "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpt1/v/t1.0-1/p160x160/11181345_952554451456983_728647573232950962_n.jpg?oh=a3c37554e8ffd25983230a9feb12f406&oe=5678FB4E&__gda__=1448997760_58b7eb52750cb08b927500e3e72b9386";
        name.appendChild(profile);
        var context = document.createElement("div");
        var userName = document.createElement("span");
        userName.textContent = item.name;
        var date = document.createElement("span");
        var now = new Date;
        date.textContent = 
            (now.getMonth()+1)+"월"+(now.getDay()-1)+"일 "+now.getHours()+"시"+now.getMinutes()+"분";
        context.appendChild(userName);
        context.appendChild(date);
        name.appendChild(context);

        var contentBox = document.createElement("div");
        contentBox.classList.add("contentBox");
        var content = document.createElement("div");
        content.textContent = item.context;
        var interaction = document.createElement("div");
        var showLike = document.createElement("span");
        showLike.setAttribute("data-like", item.like);
        showLike.textContent = "좋아요 " + showLike.getAttribute("data-like") +"개";
        showLike.classList.add("showLike");
        var showReply = document.createElement("span");
        showReply.textContent = "댓글 " + item.reply +"개"
        var showShare = document.createElement("span");
        showShare.textContent = "공유 " + item.share +"개"
        interaction.appendChild(showLike);
        interaction.appendChild(showReply);
        interaction.appendChild(showShare);
        var button = document.createElement("div");
        var like = document.createElement("span");
        like.textContent = "좋아요";
        like.classList.add("likeBtn");
        if(item.isLike){
            like.classList.add("blue");
        }
        var reply = document.createElement("span");
        reply.textContent = "댓글달기";
        reply.classList.add("replyBtn");
        var share = document.createElement("span");
        share.textContent = "공유하기";
        share.classList.add("shareBtn");
        button.appendChild(like);
        button.appendChild(reply);
        button.appendChild(share);
        button.classList.add("button");

        contentBox.appendChild(content);
        contentBox.appendChild(interaction);
        outer.appendChild(name);
        outer.appendChild(contentBox);
        outer.appendChild(button);

        outer.classList.add("node");
        
        return outer;
    }
};
