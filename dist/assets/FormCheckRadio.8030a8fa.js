import{f as o,x as c,y as m,U as p,X as y,z as a,A as V,C as b}from"./vue.f9cfebed.js";const f=["type","name","value","required"],v={class:"pl-2"},k={__name:"FormCheckRadio",props:{name:{type:String,required:!0},type:{type:String,default:"checkbox",validator:e=>["checkbox","radio","switch"].includes(e)},label:{type:String,default:null},modelValue:{type:[Array,String,Number,Boolean],default:null},inputValue:{type:[String,Number,Boolean],required:!0},required:{type:Boolean,default:!1}},emits:["update:modelValue"],setup(e,{emit:i}){const l=e,r=i,u=o({get:()=>l.modelValue,set:n=>{r("update:modelValue",n)}}),s=o(()=>l.type==="radio"?"radio":"checkbox");return(n,t)=>(c(),m("label",{class:b(e.type)},[p(a("input",{"onUpdate:modelValue":t[0]||(t[0]=d=>u.value=d),type:s.value,name:e.name,value:e.inputValue,required:e.required},null,8,f),[[y,u.value]]),t[1]||(t[1]=a("span",{class:"check min-w-[20px]"},null,-1)),a("span",v,V(e.label),1)],2))}};export{k as _};