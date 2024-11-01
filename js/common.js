//片段 亂數
function fnRandom(argMin, argMax) {
    return Math.round(argMin + Math.random() * (argMax - argMin));
};
$(function () {
    //題目列表
    let stepArr = [".step_1", ".step_2", ".step_3", ".step_4", ".step_5"];
    
    //初始 show hide
    $(".step").hide();
    //$(".step").eq(5).show();
    //題數
    let count = 0;

    //亂數取一個題目並顯示
    function fnRandomStep() {
        if (stepArr.length === 0) return null;

        // 移除所有題目的 "current" 類別
        $(".step").removeClass("current");

        let tmpIdx = Math.floor(Math.random() * stepArr.length);
        let tmpTxt = stepArr[tmpIdx];

        // 從數組中移除
        stepArr.splice(tmpIdx, 1);

        // 顯示選擇的題目
        $(tmpTxt).show().addClass("current");


        // 動畫效果
        fnTypeWrite($(".step.current .qa_title"), 100, "▌", function ($element) {
            //console.log("打字效果完成:", $element.text());
           // 動畫效果
           const $QaList = $(".step.current .ans_list button");
           animateAnsList($QaList);
        });

        return tmpTxt;
    }


    // 初始載入時隨機顯示一個題目
    fnRandomStep();

    //結果頁 result 抽籤 打字效果
    function showStepResult() {
        $(".step").removeClass("current").hide();
        $(".step_result").show().addClass("current");

        // 打字效果
        fnTypeWrite($(".step_result .qa_title"), 30, "▌", function ($element) {
        //console.log("打字效果完成:", $element.text());

          // 動畫效果
          const $QaList = $(".step.current .ans_list button");
          animateAnsList($QaList);
        });
    }

    //開始
    $(".step button[data-start]").click(function (event) {
        event.stopPropagation(); // 阻止冒泡事件
        let tmpClassName = fnRandomStep();
        $(".step").hide().filter(tmpClassName).show();
    });

    //檢測答案
    $(".step button[data-ans]").on("click", function () {

        $(this).css("pointer-events", "none");
        count++;

        //圖標
        $(this).find(".icon").show();

        //答案
        let xv = $(this).data("ans");

        //n秒後跳題
        setTimeout(() => {
            if (xv === "v") {
                //到最後一個題目
                $(".step").hide().filter(".step_result").show();
                showStepResult();
            } else if (xv === "x") {
                //錯 2題以內
                if (count <= 1) {
                    //再選一題
                    let tmpClassName = fnRandomStep();
                    $(".step").hide().filter(tmpClassName).show();
                } else {
                    //到最後一個題目
                    $(".step").hide().filter(".step_result").show();
                    showStepResult();
                }
            }
        }, 1000);

      
    });

    //結束
    $(".step button[data-end]").click(function () {
        //隨機跳一個網頁
        location.href = `result_page_${fnRandom(1, 3)}.htm`;
    });

});

//片段 打字
function fnTypeWrite($argDom, argSpeed=200, argCursor="▌",  cb) {
    $argDom.each(function(){
        let $this = $(this);
        let txtHold = $this.data("write"); //記憶文字
        let txtWrite = ""; //準備寫入
        let idx = 0;
        let timer = setInterval(() => {
            if(idx === txtHold.length){
                clearInterval(timer);
                
                if(cb){
                    cb($this); //回傳dom
                }

                $this.html(`${txtWrite}`);
                
            }else{
                txtWrite += txtHold[idx];
                idx++;
                $this.html(`${txtWrite}${argCursor}`);
            }
        }, argSpeed);
    });
}

//片段 進場動畫
function animateAnsList($elements) {
    const myTL1 = gsap.timeline();
    myTL1.fromTo($elements, { opacity: 0, y: 15 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 });
}