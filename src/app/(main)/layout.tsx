import Navbar from './components/navbar/Navbar';
import Footer from './components/footer';

type Props = {
    children: React.ReactNode;
}

const MainLayout = ({ children }: Props) => {
    return ( 
        <div className="flex flex-col min-h-screen">
            <Navbar/>
            <div className="flex-grow">
                {children}
            </div>
            <Footer/>
        </div>
     );
}

export default MainLayout;