import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Metadata } from '@/components/metadata';
import { DeleteAccountDialog } from './delete-account-dialog';

export function DangerTab() {
    return (
        <>
            <Metadata title="Danger Zone" />
            <Card>
                <CardHeader>
                    <CardTitle>Delete Account</CardTitle>
                    <CardDescription>
                        Permanently delete your account and all associated data.
                        This cannot be undone.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DeleteAccountDialog />
                </CardContent>
            </Card>
        </>
    );
}
