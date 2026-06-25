import { Link } from '@inertiajs/react';

export default function AdminLayout({
    children,
    showDashboardLink = false,
    showLeaveRequestLink = true,
    showBackButton = false,
    leaveRequestUserId = null,
}) {
    return (
        <>
            <header
                className="
                    bg-green-200
                    shadow
                "
            >
                <div
                    className="
                        max-w-7xl
                        mx-auto
                        px-6
                        py-4
                        flex
                        justify-between
                        items-center
                    "
                >

                    <h1
                        className="
                            text-xl
                            font-bold
                            text-green-900
                        "
                    >
                        管理者画面
                    </h1>

                    <div className="flex gap-3">

                        {showDashboardLink && (
                            <Link
                                href="/admin"
                                className="
                                    bg-green-600
                                    text-white
                                    px-4
                                    py-2
                                    rounded
                                "
                            >
                                管理画面トップへ
                            </Link>
                        )}

                        {showBackButton && (
                            <button
                                onClick={() =>
                                    window.history.back()
                                }
                                className="
                                    bg-yellow-500
                                    text-white
                                    px-4
                                    py-2
                                    rounded
                                "
                            >
                                戻る
                            </button>
                        )}

                        {showLeaveRequestLink &&
                            leaveRequestUserId && (
                                <Link
                                    href={
                                        `/admin/leave-requests?userId=${leaveRequestUserId}`
                                    }
                                    className="
                                        bg-blue-600
                                        text-white
                                        px-4
                                        py-2
                                        rounded
                                    "
                                >
                                    届出管理
                                </Link>
                            )}

                        <Link
                            href="/"
                            className="
                                bg-gray-600
                                text-white
                                px-4
                                py-2
                                rounded
                            "
                        >
                            ユーザー画面へ
                        </Link>

                    </div>
                </div>
            </header>

            <main>
                {children}
            </main>
        </>
    );
}