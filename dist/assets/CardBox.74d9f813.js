import{x as o,y as r,I as n,C as m,$ as B,f as d,G as i,J as l,H as v,F as b,K as x,Y as y}from"./vue.f9cfebed.js";import{b as g}from"./index.943c32fd.js";const k={__name:"CardBoxComponentBody",props:{noPadding:Boolean,centeredContent:Boolean,verticalCentered:Boolean},setup(e){return(a,s)=>(o(),r("div",{class:m(["flex-1 fipu_vertical_scrollbar",[{"p-6 ":!e.noPadding,"md:flex md:flex-col md:justify-center md:items-center md:w-full md:h-full ":e.centeredContent,"md:flex md:flex-col md:justify-center md:w-full md:h-full ":e.verticalCentered}]])},[n(a.$slots,"default")],2))}},p={},$={class:"p-6"};function w(e,a){return o(),r("footer",$,[n(e.$slots,"default")])}const F=g(p,[["render",w]]),j={__name:"CardBox",props:{hasComponentLayout:Boolean,hasTable:Boolean,isForm:Boolean,isHoverable:Boolean,isModal:Boolean,centeredContent:Boolean,verticalCentered:Boolean},emits:["submit"],setup(e,{emit:a}){const s=e,u=a,c=B(),f=d(()=>c.footer&&!!c.footer()),C=d(()=>{const t=[s.isModal?"dark:bg-slate-900":"dark:bg-slate-900/70"];return s.isHoverable&&t.push("hover:shadow-lg transition-shadow duration-500"),t}),h=t=>{u("submit",t)};return(t,_)=>(o(),i(y(e.isForm?"form":"div"),{class:m([C.value,"bg-white flex"]),onSubmit:h},{default:l(()=>[e.hasComponentLayout?n(t.$slots,"default",{key:0}):(o(),r(v,{key:1},[b(k,{"no-padding":e.hasTable||e.centeredContent||e.verticalCentered,"centered-content":e.centeredContent,"vertical-centered":e.verticalCentered},{default:l(()=>[n(t.$slots,"default")]),_:3},8,["no-padding","centered-content","vertical-centered"]),f.value?(o(),i(F,{key:0},{default:l(()=>[n(t.$slots,"footer")]),_:3})):x("",!0)],64))]),_:3},40,["class"]))}};export{j as _};
