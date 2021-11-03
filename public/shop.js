all_brands_list = []
all_cats_list = []

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
    console.log(brands, categories);

    $.post('/api/vs/products', {brands, categories}, (data, status)=>{
        console.log(data);
        if(status=="success"){
            alert("Sucess!");
        }
    })

    $($(".cont_1")[0]).hide();
    $($(".cont_2")[0]).show();

    // canvas operations
    let c = document.getElementById("outer-shop");
    let ctx = c.getContext("2d");
    // let img = document.getElementById("scream");
    // ctx.drawImage(img);
    let url = '/public/backgounds/bg2.png';
    ctx.fillStyle = `url(${url})`;
})