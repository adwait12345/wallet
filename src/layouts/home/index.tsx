import Sidebar from "../../components/sidebar";

function HomeLayout() {
  return (
    <div className="w-full h-screen flex items-center">
      <div className="w-64 h-full border-r-[1px] ">
        <Sidebar />
      </div>
      <div className="flex items-center justify-center"></div>
    </div>
  );
}

export default HomeLayout;
