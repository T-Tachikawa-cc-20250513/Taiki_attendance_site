import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';

export default function AdminLeaveRequestDetail({
    leaveRequest
}) {

    const approve = async () => {

        if (!confirm('承認しますか？')) {
            return;
        }

        try {

            await axios.post(
                `/admin/leave-request/${leaveRequest.id}/approve`
            );

            alert('承認しました');

            router.get(
                '/admin/leave-requests'
            );

        } catch (error) {

            console.log(error);

            alert('承認に失敗しました');
        }
    };

    const reject = async () => {

        const comment = prompt(
            '差戻理由を入力してください'
        );

        if (!comment) {
            return;
        }

        try {

            await axios.post(
                `/admin/leave-request/${leaveRequest.id}/reject`,
                {
                    comment: comment,
                }
            );

            alert('差戻しました');

            router.get(
                '/admin/leave-requests'
            );

        } catch (error) {

            console.log(error);

            alert('差戻に失敗しました');
        }
    };

    return (
        <AdminLayout showDashboardLink={true}>

            <Head title="届出詳細画面" />

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

                <div className="space-y-4">

                    <div>
                        <strong>社員名：</strong>
                        {leaveRequest.user?.name}
                    </div>

                    <div>
                        <strong>届出区分：</strong>
                        {leaveRequest.request_type}
                    </div>

                    <div>
                        <strong>対象日：</strong>
                        {leaveRequest.start_date}
                    </div>

                    <div>
                        <strong>理由：</strong>
                        {leaveRequest.reason}
                    </div>

                    <div>
                        <strong>状態：</strong>
                        {leaveRequest.status}
                    </div>

                    <div>
                        <strong>管理者コメント：</strong>
                        {
                            leaveRequest.manager_comment
                                ?? 'なし'
                        }
                    </div>

                    <div>

                        <strong>添付画像：</strong>

                        {
                            leaveRequest.attachment_path
                                ? (

                                    <a
                                        href={
                                            `/storage/${leaveRequest.attachment_path}`
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                        className="
                                            text-blue-600
                                            underline
                                        "
                                    >
                                        画像を表示
                                    </a>

                                )
                                : 'なし'
                        }

                    </div>

                </div>

                {
                    leaveRequest.status === '申請中'
                    && (

                        <div className="flex gap-4 mt-8">

                            <button
                                onClick={approve}
                                className="
                                    bg-green-500
                                    text-white
                                    px-6
                                    py-2
                                    rounded
                                "
                            >
                                承認
                            </button>

                            <button
                                onClick={reject}
                                className="
                                    bg-red-500
                                    text-white
                                    px-6
                                    py-2
                                    rounded
                                "
                            >
                                差戻
                            </button>

                        </div>

                    )
                }

            </div>

        </AdminLayout>
    );
}