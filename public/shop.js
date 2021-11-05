all_brands_list = []
all_cats_list = []

$($(".cont_2")[0]).hide();

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
        
         // canvas operations
        // let c = document.getElementById("outer-shop");
        // let ctx = c.getContext("2d");
        // let img = document.getElementById("scream");
        // ctx.drawImage(img);
        
        let no_of_pieces = Math.min(data.length, 8);
        for(let i=0; i<no_of_pieces; i++){
            // plain javascript here
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
       
        // for(let i=1; i<=no_of_pieces; i++){
        //     let img = new Image();   
            
        //     img.addEventListener('load', function() {
        //         // execute drawImage statements here
        //         ctx.drawImage(img, xinit, yinit, 30, 30);
        //         xinit += inc;
        //         if(inc==20) inc=40;
        //         else inc=20;
        //     }, false);

        //     img.src = data[i-1]['picture1'];
        //     console.log(img.src);
        // }
    })

    $($(".cont_1")[0]).hide();
    $($(".cont_2")[0]).show();

})