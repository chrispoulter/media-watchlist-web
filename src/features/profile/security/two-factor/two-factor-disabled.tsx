import { Button } from '@/components/ui/button';

interface TwoFactorDisabledProps {
    onEnable: () => void;
}

export function TwoFactorDisabled({ onEnable }: TwoFactorDisabledProps) {
    return (
        <Button onClick={onEnable} className="w-full sm:w-auto">
            Enable 2FA
        </Button>
    );
}
