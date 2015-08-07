function change(){
    var str = $("#input").val();
    $("#main").text(str);
    $("#input").val("");
}

$("body").on("click", "#btn", change())

