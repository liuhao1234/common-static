layui.use(["layer","form","laydate","upload","table"],function(){
    lyform = layui.form
    lydate = layui.laydate
    lyupload = layui.upload
    lytable = layui.table
    layer = layui.layer

    $(".list-form-tab").delegate("button","click",function(){
        var index = $(this).index()
        $(this).addClass("active").siblings().removeClass("active")
        $(".list-upload-form").hide().eq(index).show();
    })

    lydate.render({
        elem: '#payDate',
        type:'month'
    });
    var outTimeDate = lydate.render({
        elem: '#outTimeDate',
        change:function(value, date, endDate){
            console.log(value)
        },
        done: function(value, date, endDate){
            console.log(value)
        }
    })
    
    var upload01 = lyupload.render({
        elem: '#test1', //绑定元素
        // url: '/upload/', //上传接口
        progress: function(n, elem){
            console.log(n)
        },
        done: function(res){
          //上传完毕回调
        },
        error: function(){
          //请求异常回调
        }
    });
    var upload02 = lyupload.render({
        elem: '#test2', //绑定元素
        // url: '/upload/', //上传接口
        progress: function(n, elem){
            console.log(n)
        },
        done: function(res){
          //上传完毕回调
        },
        error: function(){
          //请求异常回调
        }
    });
    lyform.on('submit(formDemo)', function(data){
        console.log(data)
        layer.msg(JSON.stringify(data.field));
        return false;
    });
    lytable.render({
        elem: '#searchResult',
        cols: [[ //标题栏
                {field: 'username', title: '拆分项'},
                {field: '', title: '对应员工'}
            ]],
        data:searchData,
        even: true,
        page:false,
        limit:Number.MAX_VALUE,
        height:500,
        done:function(){
            labelRemove()
        }
    })

    // ztree渲染
    var zTreeObj
    var setting = {
        edit: {
            enable: true,
            showRemoveBtn: false,
            showRenameBtn: false,
            drag: {
                prev: false,
				next: false,
				inner: false
			}
        },
        data: {
			keep: {
				parent: true,
				leaf: true
			},
			simpleData: {
				enable: true
			}
		},
        callback: {
            onDrop: ztreeNodesOnDrop
        }
    }
    zTreeObj = $.fn.zTree.init($("#staffTree"), setting, ztreeData);
    lyform.on('select(approver)', function(data){
        if(data.value==1){
            $("#approverSelect").show()
        }else{
            $("#approverSelect").hide()
        }
    });
    $("#approverSelect").click(function(){
        approverPopup()
    })
})

function approverPopup(){
    layer.open({
        type: 1,
        btn:["确定","取消"],
        btnAlign:"c",
        title:"选择审批人",
        area:["800px","400px"],
        resize:false,
        content:'<div class="pUpWin-body layui-clear">'+
                    '<table class="layui-hide" id="listPreview"></table>'+
                '</div>',
        success: function(layero, index){
            lytable.render({
                id:'listPreviewTable',
                elem: '#listPreview',
                cols: [[ //标题栏
                        {field: '', type:'radio', title: ''},
                        {field: 'id', title: 'ID'},
                        {field: 'username', title: '用户名'}
                    ]],
                data:searchData,
                even: true,
                page:false,
                
                limit:Number.MAX_VALUE,
                height:258,
                totalRow:false
            })
        },
        yes:function(index, layero){
            console.log(lytable.checkStatus("listPreviewTable"))
            layer.close(index);//关闭弹窗
        }
    });
}

function ztreeNodesOnDrop(e, treeId, treeNodes){
    // console.log(e)
    // console.log(treeId)
    // console.log(treeNodes)
    var $target = $(e.target)
    if($target.hasClass("laytable-cell-1-0-1")){
        $target.append(" <span class='layui-badge layui-bg-blue layui-label'><b>"+treeNodes[0].name+"</b><i class='iconfont icon-close label-remove'></i></span> ")
    }
}

// 分配员工label删除
function labelRemove(){
    $("[lay-id=searchResult]").delegate(".label-remove","click",function(){
        $(this).parent().remove()
    })
}