import{a as E,r as n,f as F,_ as T,G as q,J as s,x as y,F as e,y as G,z as a,u as t,Q as V,P as h,A as U,K as O,T as D,N as J,O as Z}from"./vue.7e7f5872.js";import{b as P,B as H,b0 as K,_ as b,G as Q,H as W,I as X,J as Y}from"./BaseButton.1e728d8c.js";import{c as u,r as z,d as ee,i as ae,m as te,u as se,g as C}from"./validators.2340ccfd.js";import{b as le,c as ie,m as g,U as oe}from"./index.8a815c4b.js";import{_ as re,l as ne}from"./login_art.90221992.js";import{_ as M}from"./CardBox.df29294d.js";import{_ as ue}from"./FormCheckRadio.eb16ec4e.js";import{_ as S}from"./FormField.a1bdf2d9.js";import{_ as $}from"./BaseButtons.06021fb9.js";import{f as me}from"./fipu_unipu.d4f12c80.js";import"./vendor.4c47bd8f.js";const w=m=>(J("data-v-bebf6cb6"),m=m(),Z(),m),ce={key:0,class:"flex flex-col justify-center items-center overflow-hidden h-screen md:py-4 md:px-4 || transition-all duration-300"},de={class:"flex flex-col md:flex-row flex-shrink h-full rounded-lg overflow-hidden"},fe={class:"flex flex-col md:flex-row flex-shrink h-full || bg-white overflow-y-auto fipu_vertical_scrollbar || transition-all duration-300 px-0 lg:px-6 xl:px-16 2xl:px-28 || xl:gap-4 2xl:gap-8"},pe=["src"],_e={href:"https://fipu.unipu.hr/",target:"_blank"},xe=["src"],ve=w(()=>a("h2",{class:"text-2xl lg:text-3xl 2xl:text-4xl text-fipu_gray font-bold xl:mb-1 mb-2 md:mb-0 2xl:mb-4"},[h("Dobrodo\u0161li u "),a("span",{class:"text-fipu_blue"},"FIPU Praksa")],-1)),be={class:"md:text-sm lg:text-sm 2xl:text-base mb-2 2xl:mb-4 text-justify s"},ge=w(()=>a("div",{class:"text-right"},[a("a",{href:"#",class:"text-sm text-fipu_gray hover:text-fipu_blue underline"},"Zaboravili ste lozinku?")],-1)),he=w(()=>a("div",{class:"my-2 2xl:my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300"},[a("p",{class:"mx-4 mb-0 text-center dark:text-white"},"ili")],-1)),we={__name:"PasswordResetView",setup(m){const i=E({email:"admin@fipu.hr",password:"123456",remember_me:!1}),B={email:{required:u.withMessage("Polje je obavezno",z),email:u.withMessage("Molimo unesite ispravnu e-mail adresu",ee),isUnipuEmail:u.withMessage("Molimo unesite va\u0161u UNIPU e-mail adresu",ae)},password:{required:u.withMessage("Polje je obavezno",z),minLength:u.withMessage("Lozinka mora sadr\u017Eavati minimalno 6 znakova",te(6))}},c=se(B,i),d=n(!1);async function N(){if(d.value=!0,c.value.$touch(),c.value.$invalid){d.value=!1;return}let _=await g.login(i);d.value=!1,g.userAuthenticated?(v("success"),await oe.wait(1),g.handleSuccessfulLogin()):_.response.status===403?v("warning"):v("danger")}const l=n(null);let f=n(),p=n();const I=n([]),x=F(()=>I.value.indexOf("outline")>-1);function v(_){switch(_){case"success":l.value.color="success",l.value.icon=Y,l.value.duration=1,f.value="To je to!",p.value=" Uspje\u0161na prijava!";break;case"warning":l.value.color="warning",l.value.icon=X,f.value="Upozorenje.",p.value="Unijeli ste krive podatke. Provjerite unos i poku\u0161ajte ponovno.";break;case"danger":l.value.color="danger",l.value.icon=W,f.value="Gre\u0161ka!",p.value="Gre\u0161ka u sustavu.  Nije do vas, molimo poku\u0161ajte opet ili kontaktirajte profesora.";break}l.value.show()}const k=n(!1);function R(){k.value=!0}const j=ie();function L(){j.push("/register")}return(_,o)=>{const A=T("NotificationBar");return y(),q(re,{bg:"blue",class:"flex items-start min-h-screen"},{default:s(()=>[e(D,{appear:"","enter-active-class":"animate__animated animate__fadeIn","leave-active-class":"animate__animated animate__slideOutRight fast-animation",onAfterLeave:L},{default:s(()=>[k.value?O("",!0):(y(),G("div",ce,[a("div",de,[a("div",fe,[e(M,{"has-table":"",class:"hidden xl:flex justify-center items-center flex-1 bg-opacity-0 grow p-16 xl:px-0 xl:py-16 2xl:py-24 || transition-all duration-300"},{default:s(()=>[a("img",{src:t(ne),alt:"Login graphics",class:"2xl:pr-8 aspect-square max-h-full"},null,8,pe)]),_:1}),e(M,{"has-table":"",class:"flex flex-col flex-shrink flex-1 bg-opacity-0 p-8 sm:p-16 xl:pl-2 xl:px-0 xl:py-24 || transition-all duration-300","is-form":"",onSubmit:V(N,["prevent"])},{default:s(()=>[a("a",_e,[a("img",{src:t(me),alt:"fipu logo",class:"h-20 xl:h-20 mb-6 object-contain transition-all duration-300"},null,8,xe)]),ve,a("h2",be,[h(" Molimo prijavite se kako biste pregledali stanje va\u0161e prakse ili prijavili zadatke. Ukoliko \u017Eelite samo pregledati dostupne zadatke i poduze\u0107a, molimo nastavite kao gost "),a("a",{class:"hover-underline-animation cursor-pointer text-fipu_text_blue hover:text-fipu_blue",onClick:o[0]||(o[0]=r=>t(j).push("/moja-praksa"))}," ovdje ")]),e(S,{label:"E-mail"},{default:s(()=>[e(P,{modelValue:i.email,"onUpdate:modelValue":o[1]||(o[1]=r=>i.email=r),icon:t(H),name:"email",autocomplete:"email",error:t(C)(t(c),"email")},null,8,["modelValue","icon","error"])]),_:1}),e(S,{label:"Lozinka"},{default:s(()=>[e(P,{modelValue:i.password,"onUpdate:modelValue":o[2]||(o[2]=r=>i.password=r),icon:t(K),name:"password",type:"password",autocomplete:"password",placeholder:"Password",error:t(C)(t(c),"password")},null,8,["modelValue","icon","error"])]),_:1}),ge,e(ue,{modelValue:i.remember_me,"onUpdate:modelValue":o[3]||(o[3]=r=>i.remember_me=r),name:"remember",label:"Zapamti me!",class:"mb-4 2xl:mb-4","input-value":!0},null,8,["modelValue"]),e($,{class:"space-y-2"},{default:s(()=>[e(b,{type:"submit",color:"fipu_blue",label:"Prijavi se",loading:d.value,class:"w-full"},null,8,["loading"])]),_:1}),he,e($,{class:"space-y-2"},{default:s(()=>[e(b,{color:"fipu_blue",outline:"",label:"Registriraj se",class:"w-full",onClick:V(R,["prevent"])},null,8,["onClick"])]),_:1}),e(A,{ref_key:"notificationBar",ref:l,class:"animate__animated animate__fadeInUp mt-2",outline:x.value},{right:s(()=>[e(b,{icon:t(Q),color:x.value?"success":"white",outline:x.value,"rounded-full":"",small:""},null,8,["icon","color","outline"])]),default:s(()=>[a("b",null,U(t(f)),1),h(" "+U(t(p))+" ",1)]),_:1},8,["outline"])]),_:1},8,["onSubmit"])])])]))]),_:1})]),_:1})}}},Be=le(we,[["__scopeId","data-v-bebf6cb6"]]);export{Be as default};