import{x as n,y as i,C as u,F as f,J as d,z as o,P as x,A as m,u as l,I as _,r as v,G as p,U as h,a0 as k,T as y,H as g,M as B}from"./vue.20f6a325.js";import{_ as w,i as b,e as S,q as $}from"./index.4853f032.js";const V="/FIPU_praksa_logo_transparent.svg",A={__name:"BaseDivider",props:{navBar:Boolean},setup(e){const t=e;return(a,s)=>(n(),i("hr",{class:u([t.navBar?"hidden lg:block lg:my-0.5 dark:border-slate-700":"my-6 -mx-6 dark:border-slate-800","border-t border-gray-100"])},null,2))}},C={class:"text-center md:text-left"},F=o("a",{href:"https://fipu.unipu.hr/fipu",target:"_blank"},"Fakultet informatike u Puli",-1),T=o("div",{class:"md:py-2"},[o("p",null,"FIPU Praksa v1.0.0")],-1),E={__name:"FooterBar",setup(e){const t=new Date().getFullYear();return(a,s)=>(n(),i("footer",{class:u(["py-2 px-6",l(b)])},[f(w,null,{default:d(()=>[o("div",C,[o("b",null,[x("\xA9"+m(l(t))+", ",1),F]),_(a.$slots,"default")]),T]),_:3})],2))}},q={class:"flex items-center justify-center mb-3"},P={class:"text-2xl"},j={__name:"CardBoxComponentTitle",props:{title:{type:String,required:!0}},setup(e){return(t,a)=>(n(),i("div",q,[o("h1",P,m(e.title),1),_(t.$slots,"default")]))}},I={__name:"SnackBarItem",props:{lifetime:{type:Number,required:!0,validator:e=>e>=0},timestamp:{type:Number,required:!0},text:{type:String,required:!0},color:{type:String,required:!0,validator:e=>["contrast","info","success","warning","danger"].indexOf(e)>-1}},emits:["cancel"],setup(e,{emit:t}){const a=e,s=v(!1);setTimeout(()=>{s.value=!0}),a.lifetime&&setTimeout(()=>{s.value=!1,c()},a.lifetime);const c=()=>{setTimeout(()=>{t("cancel",a.timestamp)},250)},r=()=>{s.value=!1,a.lifetime||c()};return(D,M)=>(n(),p(y,{"enter-active-class":"animate-fade-in-up-fast","leave-active-class":"animate-fade-out-down-fast"},{default:d(()=>[h(o("div",{class:u([l(S)(e.color,!1,!0),"self-end my-3 px-6 py-4 shadow overflow-hidden w-full md:rounded-xl md:w-auto md:max-w-full cursor-pointer pointer-events-auto"]),onClick:r},m(e.text),3),[[k,s.value]])]),_:1}))}},N={class:"fixed inset-0 flex flex-col-reverse p-9 overflow-hidden z-100 pointer-events-none"},G={__name:"SnackBar",setup(e){const t=$(),a=s=>{t.cancelMessage(s)};return(s,c)=>(n(),i("div",N,[(n(!0),i(g,null,B(l(t).messages,r=>(n(),p(I,{key:r.timestamp,timestamp:r.timestamp,lifetime:r.lifetime,text:r.text,color:r.color,onCancel:a},null,8,["timestamp","lifetime","text","color"]))),128))]))}};export{V as F,E as _,G as a,j as b,A as c};
