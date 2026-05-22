import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Metadata } from '@/components/metadata';
import { UpdateProfileForm } from './update-profile-form';
import { UpdateEmailForm } from './update-email-form';

export function ProfileTab() {
    return (
        <>
            <Metadata title="Profile" />
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>
                            Update your personal details
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UpdateProfileForm />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Email Address</CardTitle>
                        <CardDescription>
                            Update your email address — a verification link will
                            be sent to confirm the change
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UpdateEmailForm />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
