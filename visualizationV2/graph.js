class Graph{
    constructor(mysvg){
        //SVG that will be used for graph
        this.mainSVG = document.getElementById(mysvg);
        this.width = this.mainSVG.width.animVal.value;
        this.height = this.mainSVG.height.animVal.value;
        //Basics
        this.id = "graph"+Graph.getCurrentId();
        Graph.setCurrentId();
        Graph.setListOfGraphs(this.id,mysvg,this);
        this.variables();
    }
    variables(){
        //Basics Elements
        this.SVG = create("g",{id:this.id});
        this.mainSVG.appendChild(this.SVG);
        this.listOfNodes = {};
        this.idChoosenNode = "";
        this.maxDegree = 0;
        this.listOfEdges = {};
        this.hasElements = false;
        this.makingGraph = false;
        this.workMouse();
        //Transformations: Translate t, Rotate r, Scale s
        this.translating = false;
        this.dotTranslate = {x:0,y:0};
        this.oldTranslate = {x:0,y:0};
        this.dotRotate = {x:this.width/2,y:this.height/2};
        this.infoTransf = {t:{x:0,y:0},r:[{ang:0,x:this.dotRotate.x,y:this.dotRotate.y}]};
    }
    //Id that will be used for new node
    static currentId = 1;
    static setCurrentId(){
        Graph.currentId += 1;
    }
    static getCurrentId(){
        return Graph.currentId;
    }
    //About main SVG
    setMainSVG(myid){
        this.mainSVG = document.getElementById(myid);
        this.width = this.mainSVG.width.animVal.value;
        this.height = this.mainSVG.height.animVal.value;
    }
    getMainSVG(){
        return this.mainSVG;
    }
    //About list of graphs
    static listOfGraphs = {};
    static setListOfGraphs(myid,myidms,mygraph){
        Graph.listOfGraphs[myid] = mygraph;
        Graph.listOfGraphs[myidms] = mygraph;
    }
    static getListOfGraphs(){
        return Graph.listOfGraphs;
    }
    static getGraphById(myid){
        return Graph.listOfGraphs[myid];
    }
    static getGraphByIdMS(myid){
        return Graph.listOfGraphs[myid];
    }
    //Reset the entire graph
    reset(){
        this.getMainSVG().removeChild(this.SVG);
        this.variables();
    }
    //About list of nodes
    setListOfNodes(myid,mynode){
        this.listOfNodes[myid] = mynode;
        if (this.hasElements===false){
            this.hasElements = true;
        }
    }
    getListOfNodes(){
        return this.listOfNodes;
    }
    getNodeById(myid){
        return this.listOfNodes[myid];
    }
    getLastNode(){
        var auxId = Object.keys(this.getListOfNodes())[Object.keys(this.getListOfNodes()).length];
        return this.listOfNodes[auxId];
    }
    setMaxDegree(mydegree){
        this.maxDegree = Math.max(this.maxDegree,mydegree);
    }
    getMaxDegree(){
        return this.maxDegree;
    }
    //Draw all of nodes for they overlap the edges
    drawAllNodes(){
        for (var i in this.getListOfNodes()){
            this.getListOfNodes()[i].overlap();
        }
    }
    //About list of edges
    setListOfEdges(myid,myedge){
        this.listOfEdges[myid] = myedge;
    }
    getListOfEdges(){
        return this.listOfEdges;
    }
    getEdgeById(myid){
        return this.listOfEdges[myid];
    }
    //Transformation functions
    updateTransf(){
        var strTranslate = "translate("+Object.values(this.infoTransf.t).join(" ")+") ";
        var strRotate = "";
        for (var i=0;i<this.infoTransf.r.length;i++){
            strRotate += "rotate("+Object.values(this.infoTransf.r[i]).join(" ")+") ";
        }
        //var strScale = "scale("+this.infoTransf.s+")";
        var strTransform = strTranslate+strRotate; //+strScale;
        this.SVG.setAttribute("transform",strTransform);
    }
    getInverseTransf(x,y){
        var x1 = x-this.infoTransf.t.x;
        var y1 = y-this.infoTransf.t.y;
        for (var i=0;i<this.infoTransf.r.length;i++){
            var x2 = x1-this.infoTransf.r[i].x;
            var y2 = y1-this.infoTransf.r[i].y;
            var x3 = x2*cos(this.infoTransf.r[i].ang)+y2*sin(this.infoTransf.r[i].ang);
            var y3 = -x2*sin(this.infoTransf.r[i].ang)+y2*cos(this.infoTransf.r[i].ang);
            var x4 = x3+this.infoTransf.r[i].x;
            var y4 = y3+this.infoTransf.r[i].y;
            x1 = x4;
            y1 = y4;
        }
        //var x5 = x1/this.infoTransf.s;
        //var y5 = y1/this.infoTransf.s;
        return {x:x1,y:y1};
    }
    //Translate
    translate(evt){
        this.infoTransf.t.x = evt.offsetX-this.dotTranslate.x+this.oldTranslate.x;
        this.infoTransf.t.y = evt.offsetY-this.dotTranslate.y+this.oldTranslate.y;
        this.updateTransf();
        let auxDot = this.getInverseTransf(this.width/2,this.height/2);
        this.dotRotate.x = auxDot.x;
        this.dotRotate.y = auxDot.y;
    }
    //Rotate
    rotate(evt){
        let lastRotate = this.infoTransf.r[this.infoTransf.r.length-1];
        if (lastRotate.x===this.dotRotate.x && lastRotate.y===this.dotRotate.y){}
        else {
            this.infoTransf.r.push({ang:0, x:this.dotRotate.x, y:this.dotRotate.y});
        }

        this.infoTransf.r[this.infoTransf.r.length-1].ang += 5;
        if (this.infoTransf.r[this.infoTransf.r.length-1].ang===360){
            this.infoTransf.r[this.infoTransf.r.length-1].ang = 0;
        }
        this.updateTransf();
    }
    //Scale
    scale(evt){
        
    }

    //Mouse functions
    workMouse(){
        this.getMainSVG().onmousedown = function(evt){
            Graph.getGraphByIdMS(this.getAttribute("id")).mouseDown(evt);
        }
        this.getMainSVG().onmouseup = function(){
            Graph.getGraphByIdMS(this.getAttribute("id")).mouseUp();
        }
        this.getMainSVG().onmousemove = function(evt){
            Graph.getGraphByIdMS(this.getAttribute("id")).mouseMove(evt);
        }
        this.getMainSVG().onmouseout = function(evt){
            Graph.getGraphByIdMS(this.getAttribute("id")).mouseOut(evt);
        }
        this.getMainSVG().onmousewheel =function(evt){
            Graph.getGraphByIdMS(this.getAttribute("id")).mouseWheel(evt);
        }
    }
    mouseDown(evt){
        this.getMainSVG().setAttribute("cursor","move");
        this.translating = true;
        this.oldTranslate.x = this.infoTransf.t.x;
        this.oldTranslate.y = this.infoTransf.t.y;
        this.dotTranslate.x = evt.offsetX;
        this.dotTranslate.y = evt.offsetY;
    }
    mouseUp(){
        this.getMainSVG().setAttribute("cursor","default");
        this.translating = false;
    }
    mouseMove(evt){
        if (this.idChoosenNode!==""){
            this.getNodeById(this.idChoosenNode).mouseMove(evt);
        }
        else if(this.translating){
            this.translate(evt);
        }
        /*let auxDot = this.getInverseTransf(evt.offsetX,evt.offsetX);
        this.dotRotate.x = auxDot.x;
        this.dotRotate.y = auxDot.y;*/
    }
    mouseOut(evt){
        this.getMainSVG().setAttribute("cursor","default");
        this.translating = false;
    }
    mouseWheel(evt){
        this.scale(evt);
    }

    //The first graph type: random
    randomGraph(n,p){
        if (this.makingGraph===true){
            clearInterval(this.myInterval);
        }
        this.reset();
        var auxGraph = this;
        this.makingGraph = true;
        this.myInterval = setInterval(function() {
            if (Object.keys(auxGraph.getListOfNodes()).length>=n){
                clearInterval(auxGraph.myInterval);
                auxGraph.makingGraph = false;
            }
            else{
                Node.randomNode(auxGraph.id,p);
            auxGraph.getListOfNodes()[auxGraph.getListOfNodes().length];
            }
        },2000);
    }
    //The first rank type: degree
    rankByDegree(){
        if(this.maxDegree<=50){
            for (var i in this.getListOfNodes()){
                this.getListOfNodes()[i].rankByDegree();
            }
        }
    }
}