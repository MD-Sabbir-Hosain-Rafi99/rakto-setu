import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        alert("Logged out successfully!");
        navigate("/login");
        window.location.reload();
    };

    return (
        <nav className="bg-green-950 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">

                <div className="flex justify-between items-center py-4">

                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-3xl font-bold"
                    >
                        🩸 RaktoSetu
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">

                        <Link to="/">Home</Link>

                        <Link to="/find-donor">
                            Find Donor
                        </Link>

                        <Link to="/emergency-request">
                            Emergency
                        </Link>

                        {user ? (
                            <>
                                <Link to="/dashboard">
                                    Dashboard
                                </Link>

                                <span className="font-semibold text-green-300">
                                    Hi, {user.name.split(" ")[0]}
                                </span>

                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 px-4 py-2 rounded-lg"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    Login
                                </Link>

                                <Link to="/register">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Button */}
                    <button
                        className="md:hidden text-3xl"
                        onClick={() => setOpen(!open)}
                    >
                        ☰
                    </button>
                </div>

                {/* Mobile Menu */}
                {open && (
                    <div className="md:hidden flex flex-col gap-4 pb-4">

                        <Link to="/">Home</Link>

                        <Link to="/find-donor">
                            Find Donor
                        </Link>

                        <Link to="/emergency-request">
                            Emergency
                        </Link>

                        {user ? (
                            <>
                                <Link to="/dashboard">
                                    Dashboard
                                </Link>

                                <span>
                                    Hi, {user.name.split(" ")[0]}
                                </span>

                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 py-2 rounded-lg"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    Login
                                </Link>

                                <Link to="/register">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;