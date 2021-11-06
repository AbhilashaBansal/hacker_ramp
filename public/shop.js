all_brands_list = []
all_cats_list = []

$($(".cont_2")[0]).hide();
let move_forward = false;
let move_back = false;

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


$("#create-btn").click((e)=>{
    brands = [];
    categories = [];

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
            let img = document.createElement('img');
            img.classList.add("product-img");
            img.dataset.prod_id = data[i]['id'];
            img.dataset.index = i;
            img.src = data[i]['picture1'];
            img.width=120;
            img.height=120;
            if(data[i]['category']=='Dresses' || data[i]['category']=='Jeans'){
                img.height = 140;
            }
            document.getElementById('id111').appendChild(img);

            // product modal
            img.addEventListener('click', (e)=>{
                let idx = e.target.dataset.index;
                let imgsrc = data[idx]['picture1'];
                let brand = data[idx]['brand'];
                let name = data[idx]['name'];
                let desc = data[idx]['description'];
                let price = data[idx]['price'];
                let discount = data[idx]['discount'];

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

        for(; i<data.length; i++){
            let img = document.createElement('img');
            img.classList.add("product-img");
            img.dataset.prod_id = data[i]['id'];
            img.dataset.index = i;
            img.src = data[i]['picture1'];
            img.width=180;
            img.height=180;
            if(data[i]['category']=='Dresses' || data[i]['category']=='Jeans'){
                img.height = 200;
            }
            document.getElementById('id333').appendChild(img);
            // product modal
            img.addEventListener('click', (e)=>{
                let idx = e.target.dataset.index;
                let imgsrc = data[idx]['picture1'];
                let brand = data[idx]['brand'];
                let name = data[idx]['name'];
                let desc = data[idx]['description'];
                let price = data[idx]['price'];
                let discount = data[idx]['discount'];

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
        
    })

    $($(".cont_1")[0]).hide();
    $($(".cont_2")[0]).show();

    // canvas operations
    // let c = document.getElementById("outer-shop");
    // let ctx = c.getContext("2d");
    // let img = document.getElementById("scream");
    // ctx.drawImage(img);

    // // canvas operations
    // let c = document.getElementById("canvas1");
    // let ctx = c.getContext("2d");
    // ctx.imageSmoothingEnabled = false;
    // let img = new Image();
    // img.src = './backgounds/char1_.png';
    // img.addEventListener('load', function() {
    //     ctx.drawImage(img, 60, 60, 30, 50);
    // }, false);  
    
    $('body').keydown((e)=>{
        // console.log("Investigating");
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
            str = String(str)+"px";
            $("#cust_avatar").css({'left': str});
            console.log("Moving right...");

            rmi = (rmi+1)%rpics.length;
            $("#cust_avatar").attr('src', rpics[rmi]);
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
    }
    
    // requestAnimationFrame(movement);
}

setInterval(() => {
    movement();
}, 100);

$("#id333").hide();
$(".dyn-btn").click(()=>{
    $("#id333").toggle();
})