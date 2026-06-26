import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({
    request
}) {

    return (
        <MainLayout>

            <Head title="届出詳細" />

            <div
                className="
                    max-w-4xl
                    mx-auto
                    bg-white
                    p-8
                    shadow
                    rounded
                "
            >

                <h1
                    className="
                        text-3xl
                        font-bold
                        mb-8
                    "
                >
                    届出詳細画面
                </h1>

                {/* 届出区分 */}
                <div className="mb-5">

                    <label className="font-bold">
                        届出区分
                    </label>

                    <div
                        className="
                            border
                            rounded
                            p-3
                            mt-2
                        "
                    >
                        {request.request_type}
                    </div>

                </div>

                {/* 対象日 */}
                <div className="mb-5">

                    <label className="font-bold">
                        対象日
                    </label>

                    <div
                        className="
                            border
                            rounded
                            p-3
                            mt-2
                        "
                    >
                        {request.start_date}
                    </div>

                </div>

                {/* 理由 */}
                <div className="mb-5">

                    <label className="font-bold">
                        理由
                    </label>

                    <div
                        className="
                            border
                            rounded
                            p-3
                            mt-2
                            whitespace-pre-wrap
                        "
                    >
                        {request.reason}
                    </div>

                </div>

                {/* 添付画像 */}
                <div className="mb-5">

                    <label className="font-bold">
                        添付画像
                    </label>

                    <div className="mt-2">

                        {request.image_path ? (

                            <img
                                src={`/storage/${request.image_path}`}
                                alt="添付画像"
                                className="
                                    max-w-md
                                    border
                                    rounded
                                "
                            />

                        ) : (

                            <div>
                                添付ファイルなし
                            </div>

                        )}

                    </div>

                </div>

                {/* ステータス */}
                <div className="mb-5">

                    <label className="font-bold">
                        申請状況
                    </label>

                    <div
                        className="
                            border
                            rounded
                            p-3
                            mt-2
                        "
                    >
                        {request.status}
                    </div>

                </div>

                {/* 差戻理由 */}
                <div className="mb-8">

                    <label className="font-bold">
                        差戻理由
                    </label>

                    <div
                        className="
                            border
                            rounded
                            p-3
                            mt-2
                            bg-gray-50
                            whitespace-pre-wrap
                        "
                    >
                        {request.reject_reason ?? '-'}
                    </div>

                </div>

                <Link
                    href="/leave-requests"
                    className="
                        bg-gray-500
                        text-white
                        px-5
                        py-2
                        rounded
                    "
                >
                    戻る
                </Link>

            </div>

        </MainLayout>
    );
}