import { Button } from '@/components/ui/button';

interface TwoFactorEnabledProps {
    onDisable: () => void;
    onGenerateBackupCodes: () => void;
}

export function TwoFactorEnabled({
    onDisable,
    onGenerateBackupCodes,
}: TwoFactorEnabledProps) {
    return (
        <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button variant="destructive" onClick={onDisable}>
                Disable 2FA
            </Button>
            <Button variant="outline" onClick={onGenerateBackupCodes}>
                Regenerate Backup Codes
            </Button>
        </div>
    );
}
