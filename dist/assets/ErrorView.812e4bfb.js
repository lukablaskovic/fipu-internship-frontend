import{f as l,w as i,z as d,x as u}from"./index.fe929ab9.js";import{f as p,x as n,y as m,I as _,C as c,G as f,J as o,F as g,z as a}from"./vue.7e7f5872.js";import{_ as h}from"./CardBox.85c849c3.js";import"./vendor.4c47bd8f.js";const k={__name:"SectionFullScreen",props:{bg:{type:String,required:!0,validator:e=>["blue","pinkRed"].includes(e)}},setup(e){const s=e,t=p(()=>{if(l.darkMode)return i;switch(s.bg){case"blue":return u;case"pinkRed":return d}return""});return(r,B)=>(n(),m("div",{class:c(["flex min-h-screen items-center justify-center",t.value])},[_(r.$slots,"default",{cardClass:"shadow-2xl m-2"})],2))}},x=a("div",{class:"space-y-3"},[a("h1",{class:"text-2xl"},"\u274CNe\u0161to se zeznulo. Sorry!"),a("p",null,"Aplikacija ne radi. Vjerojatno radimo na tome, probaj refreshat!")],-1),w={__name:"ErrorView",setup(e){return(s,t)=>(n(),f(k,{bg:"blue"},{default:o(({cardClass:r})=>[g(h,{class:c(["rounded-lg",r])},{default:o(()=>[x]),_:2},1032,["class"])]),_:1}))}};export{w as default};
