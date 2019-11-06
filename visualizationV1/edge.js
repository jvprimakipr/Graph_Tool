class Edge{
    constructor(myidgraph,myidNode1,myidNode2){
        //Basics
        this.id = "edge"+Edge.getCurrentId();
        Edge.setCurrentId();
        this.idGraph = myidgraph;
        Graph.getGraphById(this.idGraph).setListOfEdges(this.id,this);
        //About source and target
        this.idSource = myidNode1;
        this.idTarget = myidNode2;
        var infoInit = {id:this.id,stroke:"rgb(0, 48, 102)","stroke-width":"2",cursor:"pointer"};
        var source = document.getElementById(this.idSource);
        var target = document.getElementById(this.idTarget);
        infoInit.x1 = source.getAttribute("cx");
        infoInit.y1 = source.getAttribute("cy");
        infoInit.x2 = target.getAttribute("cx");
        infoInit.y2 = target.getAttribute("cy");
        this.SVG = create("line",infoInit);
        Graph.getGraphById(this.idGraph).getNodeById(this.idSource).edges = this.id;
        Graph.getGraphById(this.idGraph).getNodeById(this.idTarget).edges = this.id;
        this.workMouse();
    }
    //Draw the edge
    draw(){
        Graph.getGraphById(this.idGraph).SVG.appendChild(this.SVG);
        Graph.getGraphById(this.idGraph).drawAllNodes();
    }
    //Remove the node
    remove(){
        Graph.getGraphById(this.idGraph).SVG.removeChild(this.SVG);
    }
    //Overlap the node
    overlap(){
        this.remove();
        this.draw();
    }
    update(){
        var source = document.getElementById(this.idSource);
        var target = document.getElementById(this.idTarget);
        this.SVG.setAttribute("x1",source.getAttribute("cx"));
        this.SVG.setAttribute("y1",source.getAttribute("cy"));
        this.SVG.setAttribute("x2",target.getAttribute("cx"));
        this.SVG.setAttribute("y2",target.getAttribute("cy"));
    }
    //Animation the edge, from source to target
    /*animation(){
        var ghost = create("line",{x1:this.SVG.getAttribute(x1),y1:this.SVG.getAttribute(y1),
            x2:this.SVG.getAttribute(x2),y2:this.SVG.getAttribute(y2),stroke:"rgb(0, 48, 102)","stroke-width":"2"});
        Graph.getCurrentSVG().appendChild(ghost);
        var vector = {x:this.SVG.x2-this.SVG.x1, y:this.SVG.y2-this.SVG.y1};
        
        var animInterval = setInterval(function() {

        },1);
    }*/
    //Id that will be used for new edge
    static currentId = 1;
    static setCurrentId(){
        Edge.currentId += 1;
    }
    static getCurrentId(){
        return Edge.currentId;
    }
    //Color functions
    //Default color of edge
    static defaultColor = "rgb(0, 48, 102)";
    //Change color of edge
    changeColor(newColor = Edge.defaultColor){
        this.SVG.setAttribute("stroke",newColor);
    }
    //Mouse functions
    workMouse(){
        var auxId = this.idGraph;
        this.SVG.onmouseenter = function(){
            Graph.getGraphById(auxId).getEdgeById(this.getAttribute("id")).mouseEnter();
        }
        this.SVG.onmouseleave = function(){
            Graph.getGraphById(auxId).getEdgeById(this.getAttribute("id")).mouseLeave();
        }
    }
    mouseEnter(){
        this.changeColor("rgb(230,0,0)");
        Graph.getGraphById(this.idGraph).getNodeById(this.idSource).overlap();
        Graph.getGraphById(this.idGraph).getNodeById(this.idSource).changeColor("rgb(230,0,0)");
        Graph.getGraphById(this.idGraph).getNodeById(this.idTarget).overlap();
        Graph.getGraphById(this.idGraph).getNodeById(this.idTarget).changeColor("rgb(230,0,0)");
    }
    mouseLeave(){
        this.changeColor();
        Graph.getGraphById(this.idGraph).getNodeById(this.idSource).changeColor();
        Graph.getGraphById(this.idGraph).getNodeById(this.idTarget).changeColor();
    }
}