all_brands_list = []
all_cats_list = []

$($(".cont_2")[0]).hide();
let move_forward = false;
let move_back = false;

let tick=0;

// FILTERING LOGIC
async function get_brands_categories(){
    await $.get('/api/all_brands', (data)=>{
        for(let i=0; i<data.length; i++){
            all_brands_list.push(data[i]["brand"]);
        }
    })

    await $.get('/api/all_cats', (data)=>{
        for(let i=0; i<data.length; i++){
            all_cats_list.push(data[i]["category"]);
        }
    })
}

async function create_checkboxes(){
    await get_brands_categories();

    let bl = $("#brands_list")
    for(let i=0; i<all_brands_list.length; i++){
        let html = `<div class="form-check">
            <input class="form-check-input br" type="checkbox" value="" id="${all_brands_list[i]}" data-brand="${all_brands_list[i]}">
            <label class="form-check-label" for="${all_brands_list[i]}">
                ${all_brands_list[i]}
            </label>
        </div>`;

        bl.append(html);
    }

    let cl = $("#cats_list")
    for(let i=0; i<all_cats_list.length; i++){
        let html = `<div class="form-check">
            <input class="form-check-input cat" type="checkbox" value="" id="${all_cats_list[i]}" data-cat="${all_cats_list[i]}">
            <label class="form-check-label" for="${all_cats_list[i]}">
                ${all_cats_list[i]}
            </label>
        </div>`;

        cl.append(html);
    }
}

create_checkboxes();


// fn to dynamically append product images
function dynamicImages(obj, ele_id, i, cls){
    let img = document.createElement('img');
    img.classList.add(cls);
    img.dataset.prod_id = obj['id'];
    img.dataset.index = i;
    img.src = obj['picture1'];
    img.width=120;
    img.height=120;
    if(obj['category']=='Dresses' || obj['category']=='Jeans'){
        img.height = 140;
    }
    document.getElementById(ele_id).appendChild(img);

    img.addEventListener('click', (e)=>{
        let idx = e.target.dataset.index;
        let imgsrc = obj['picture1'];
        let brand = obj['brand'];
        let name = obj['name'];
        let desc = obj['description'];
        let price = obj['price'];
        let discount = obj['discount'];

        $($(".prod-img")[0]).attr('src', imgsrc);
        $($(".prod-brand")[0]).html(brand);
        $($(".prod-name")[0]).html(name);
        $($(".prod-desc")[0]).html(desc);
        $($(".prod-price")[0]).html("Price: " + price);
        $($(".prod-disc")[0]).html("Discount: " + discount);

        let modal = new bootstrap.Modal(document.getElementById('productModal'), {})
        modal.show();
        // console.log("Modal to be launched . . .");
    })
}


// SHOP CREATION
$("#create-btn").click(function(e){
    brands = [];
    categories = [];
    tick++;

    br = $(".br");
    cat = $(".cat");

    for(let i=0; i<br.length; i++){
        if($(br[i]).is(":checked")){
            brands.push($(br[i]).data().brand);
        }
    }

    for(let i=0; i<cat.length; i++){
        if($(cat[i]).is(":checked")){
            categories.push($(cat[i]).data().cat);
        }
    }
    // console.log(brands, categories);


    $.post('/api/vs/products', {brands, categories}, (data, status)=>{
        // console.log(data);
        
        let no_of_pieces = Math.min(data.length, 7);
        let i=0;
        for(i=0; i<no_of_pieces; i++){
            // plain javascript here
            // dynamically appending images
            dynamicImages(data[i], 'id111', i, "product-img");
        }

        for(; i<data.length; i++){
            dynamicImages(data[i], 'id333', i, "product-img2");
        }
        
        $.get('/api/recommended', (pro)=>{
            dynamicImages(pro, 'id111', i, "product-img");
            data.push(pro);
        })
    })

    $($(".cont_1")[0]).hide();
    $($(".cont_2")[0]).show();
 
    
    // event listeners for char movement
    $('body').keydown((e)=>{
        // console.log("Investigating");
        tick++;
        if(e.keyCode==39){
            // right arrow key
            move_forward = true;
            move_back = false;
            console.log("Right arrow key pressed...");
        }
        else if(e.keyCode==37){
            // left arrow key
            move_back = true;
            move_forward = false;
            console.log("Left arrow key pressed...");
        }
    })
    $('body').keyup((e)=>{
        tick++;
        if(e.keyCode==39){
            // right arrow key
            move_forward = false;
        }
        else if(e.keyCode==37){
            // left arrow key
            move_back = false;
        }
    })

    movement();
})


// - - - - - - - - - - - - - - - - - - - - - - - - - 
// CHARACTER MOVEMENT (very primitive)
let rpics = ['./backgounds/char3.png','./backgounds/char3.png','./backgounds/char4.png','./backgounds/char4.png','./backgounds/char5.png','./backgounds/char5.png',
'./backgounds/char3.png','./backgounds/char3.png','./backgounds/char2.png','./backgounds/char2.png'];
let lpics = ['./backgounds/char6.png','./backgounds/char6.png','./backgounds/char7.png','./backgounds/char7.png',
'./backgounds/char8.png','./backgounds/char8.png','./backgounds/char9.png','./backgounds/char9.png'];

let rmi=0;
let lmi=0;
function movement() {
    //character movement (very primitive)
    if(move_forward==true){
        let pos = $("#cust_avatar").position();
        let str = (pos['left']+10);
        if(str<=(window.innerWidth*(5/8))){
            if(str>=(window.innerWidth*(4/8))){
                $(".dyn-btn").show();
            }
            str = String(str)+"px";
            $("#cust_avatar").css({'left': str});
            console.log("Moving right...");

            rmi = (rmi+1)%rpics.length;
            $("#cust_avatar").attr('src', rpics[rmi]);
            tick++;
        }
    }
    if(move_back==true){
        let pos = $("#cust_avatar").position();
        let str = (pos['left']-10);
        if(str>=0){
            str = String(str)+"px";
            $("#cust_avatar").css({'left': str});

            lmi = (lmi+1)%lpics.length;
            $("#cust_avatar").attr('src', lpics[lmi]);
        }   
        tick++;
    }
    
    // requestAnimationFrame(movement);
}

setInterval(() => {
    movement();
    // tick++;
    if(tick>=300){
        $(".dyn-btn2").show();
    }
}, 100);

$("#id333").hide();
$(".dyn-btn").click(()=>{
    $("#id333").toggle();
})


// COUPON CONFETTI
function randomize(collection) {
    let randomNumber = Math.floor(Math.random() * collection.length);
    return collection[randomNumber];
}
  
function confetti() {
    $(".confetti").remove();
    let $confettiItems = $('<div class="confetti"></div>'),
        colors = ["#3b5692", "#f9c70b", "#00abed", "#ea6747"],
        height = 6.6,
        width = 6.6;
  
    let scale, $confettiItem;
  
    for (let i = 0; i < 100; i++) {
        scale = Math.random() * 1.75 + 1;
        $confettiItem = $(
            "<svg class='confetti-item' width='" +
            width * scale +
            "' height='" +
            height * scale +
            "' viewbox='0 0 " +
            width +
            " " +
            height +
            "'>\n  <use transform='rotate(" +
            Math.random() * 360 +
            ", " +
            width / 2 +
            ", " +
            height / 2 +
            ")' xlink:href='#svg-confetti' />\n</svg>"
        );
        $confettiItem.css({
            animation:
            Math.random() +
            2 +
            "s " +
            Math.random() * 2 +
            "s confetti-fall ease-in both",
            color: randomize(colors),
            left: Math.random() * 100 + "vw"
        });
        $confettiItems.append($confettiItem);
    }
    $("body").append($confettiItems);
}
  
$("#couponModal").on("shown.bs.modal", function() {
    confetti();
    console.log("Hurray");
});
  