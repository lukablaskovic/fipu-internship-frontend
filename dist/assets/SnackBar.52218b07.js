import{x as o,y as l,C as u,F as x,J as d,z as n,N as v,A as m,u as c,I as p,r as k,G as f,U as h,a0 as y,T as g,H as B,M as w}from"./vue.f9cfebed.js";import{_ as b,n as S,f as C,w as F}from"./index.86b5d783.js";const z="/FIPU_praksa_logo_transparent.svg",V={__name:"BaseDivider",props:{navBar:Boolean},setup(e){const t=e;return(a,s)=>(o(),l("hr",{class:u([t.navBar?"hidden lg:block lg:my-0.5 dark:border-slate-700":"my-6 -mx-6 dark:border-slate-800","border-t border-gray-100"])},null,2))}},$={class:"text-center md:text-left"},A={__name:"FooterBar",setup(e){const t=new Date().getFullYear();return(a,s)=>(o(),l("footer",{class:u(["py-2 px-6",c(S)])},[x(b,null,{default:d(()=>[n("div",$,[n("b",null,[v("\xA9"+m(c(t))+", ",1),s[0]||(s[0]=n("a",{href:"https://fipu.unipu.hr/fipu",target:"_blank"},"Fakultet informatike u Puli",-1))]),p(a.$slots,"default")]),s[1]||(s[1]=n("div",{class:"md:py-2"},[n("p",null,"FIPU Praksa v1.0.0")],-1))]),_:3})],2))}},T={class:"flex items-center justify-center mb-3"},N={class:"text-2xl"},E={__name:"CardBoxComponentTitle",props:{title:{type:String,required:!0}},setup(e){return(t,a)=>(o(),l("div",T,[n("h1",N,m(e.title),1),p(t.$slots,"default")]))}},q={__name:"SnackBarItem",props:{lifetime:{type:Number,required:!0,validator:e=>e>=0},timestamp:{type:Number,required:!0},text:{type:String,required:!0},color:{type:String,required:!0,validator:e=>["contrast","info","success","warning","danger"].indexOf(e)>-1}},emits:["cancel"],setup(e,{emit:t}){const a=e,s=t,i=k(!1);setTimeout(()=>{i.value=!0}),a.lifetime&&setTimeout(()=>{i.value=!1,r()},a.lifetime);const r=()=>{setTimeout(()=>{s("cancel",a.timestamp)},250)},_=()=>{i.value=!1,a.lifetime||r()};return(P,D)=>(o(),f(g,{"enter-active-class":"animate-fade-in-up-fast","leave-active-class":"animate-fade-out-down-fast"},{default:d(()=>[h(n("div",{class:u([c(C)(e.color,!1,!0),"self-end my-3 px-6 py-4 shadow overflow-hidden w-full md:rounded-xl md:w-auto md:max-w-full cursor-pointer pointer-events-auto"]),onClick:_},m(e.text),3),[[y,i.value]])]),_:1}))}},I={class:"fixed inset-0 flex flex-col-reverse p-9 overflow-hidden z-100 pointer-events-none"},j={__name:"SnackBar",setup(e){const t=F(),a=s=>{t.cancelMessage(s)};return(s,i)=>(o(),l("div",I,[(o(!0),l(B,null,w(c(t).messages,r=>(o(),f(q,{key:r.timestamp,timestamp:r.timestamp,lifetime:r.lifetime,text:r.text,color:r.color,onCancel:a},null,8,["timestamp","lifetime","text","color"]))),128))]))}};export{z as F,A as _,j as a,E as b,V as c};
