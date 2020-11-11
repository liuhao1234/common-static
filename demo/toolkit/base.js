layui.use(["layer","form","laydate"],function(){
    laydate = layui.laydate
    layer = layui.layer
    form = layui.form

    laydate.render({
        elem: '#curDate'
    });

    laydate.render({
        elem: '#compareDate'
    });

    form.on('radio(user)', function(data){
        console.log(data.elem); //得到radio原始DOM对象
        console.log(data.value); //被点击的radio的value值
    }); 

    $("#preview").click(function(){
        var data01 = form.val('conditionCheck');
        var data02 = form.val('moduleCheck');
        var data03 = form.val('tierCheck');
        console.log(data01)
        console.log(data02)
        console.log(data03)
    })
    $("#tierList").delegate(".icon-close","click",function(){
        $(this).parents(".layui-col-lg2").remove();
        sortTierItems("#tierList")
    })
    // 模型组选择
    new Sortable($("#moduleGroupList").get(0), {
        group: {
            pull: 'clone'
        },
        sort:false,
        animation: 150
    });
    // 层级选择
    new Sortable($("#tierList").get(0), {
        group: {
            pull: false,
            put:true
        },
        animation: 150,
        onAdd:function(e){
            sortTierItems(e.target)
        },
        onEnd:function(e){
            sortTierItems(e.target)
        }
    });
})

// 对层级item进行排序
function sortTierItems(element){
    var tierItems = $(element).find(".block-item:not(.check-more)")
    tierItems.each(function(index,element){
        // console.log(index)
        var index = index+1
        var $this = $(element)
        $this.find(".layui-form-item").addClass("form-wrap");
        $this.find(".module-title").remove();
        $this.prepend('<div class="module-title"><h4 class="icon0'+index+'"><i>'+index+'</i><span>第'+index+'层</span><small class="iconfont icon-close"></small></h4></div>')
    })
}