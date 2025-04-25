import React from 'react';

const Folder = ({ name }) => {
  return (
    <section className="relative group flex flex-col items-center justify-center w-full h-full">
      <div className="file relative w-40 h-28 cursor-pointer origin-bottom [perspective:1500px] ">
        <div className="work-5 bg-purple-900 w-full h-full origin-top rounded-2xl rounded-tl-none group-hover:shadow-[0_10px_20px_rgba(0,0,0,.3)] transition-all ease duration-300 relative after:absolute after:content-[''] after:bottom-[99%] after:left-0 after:w-14 after:h-2 after:bg-purple-900 after:rounded-t-2xl before:absolute before:content-[''] before:-top-[10px] before:left-[50px] before:w-3 before:h-3 before:bg-purple-900 before:[clip-path:polygon(0_35%,0%_100%,50%_100%);]" />
        
        <div className="work-4 absolute inset-1 bg-purple-800 rounded-2xl transition-all ease duration-300 origin-bottom select-none group-hover:[transform:rotateX(-20deg)]" />
        <div className="work-3 absolute inset-1 bg-purple-700 rounded-2xl transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-30deg)]" />
        <div className="work-2 absolute inset-1 bg-purple-600 rounded-2xl transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-38deg)]" />
        
        <div className="work-1 absolute bottom-0 bg-gradient-to-t from-purple-700 to-purple-500 w-full h-[110px] rounded-2xl rounded-tr-none after:absolute after:content-[''] after:bottom-[99%] after:right-0 after:w-[100px] after:h-[12px] after:bg-purple-500 after:rounded-t-2xl before:absolute before:content-[''] before:-top-[8px] before:right-[95px] before:size-2 before:bg-purple-500 before:[clip-path:polygon(100%_14%,50%_100%,100%_100%);] transition-all ease duration-300 origin-bottom flex items-end justify-center group-hover:shadow-[inset_0_10px_20px_#a855f7,_inset_0_-10px_20px_#6b21a8] group-hover:[transform:rotateX(-46deg)_translateY(1px)]">
          <span className="text-sm text-white font-semibold mb-3 px-2 text-center truncate w-full">{name}</span>
        </div>
      </div>
     
    </section>
  );
}

export default Folder;
