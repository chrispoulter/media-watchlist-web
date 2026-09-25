import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel } from '@/components/ui/field';
import { roleOptions, type UserRole } from '@/lib/permissions';

interface RoleCheckboxesProps {
    idPrefix: string;
    value: UserRole[];
    onChange: (value: UserRole[]) => void;
}

export function RoleCheckboxes({
    idPrefix,
    value,
    onChange,
}: RoleCheckboxesProps) {
    const toggle = (role: UserRole, checked: boolean) =>
        onChange(
            checked
                ? roleOptions
                      .map((option) => option.value)
                      .filter((r) => r === role || value.includes(r))
                : value.filter((r) => r !== role)
        );

    return (
        <div className="space-y-2">
            {roleOptions.map((option) => (
                <Field key={option.value} orientation="horizontal">
                    <Checkbox
                        id={`${idPrefix}-${option.value}`}
                        checked={value.includes(option.value)}
                        onCheckedChange={(checked) =>
                            toggle(option.value, checked === true)
                        }
                    />
                    <FieldLabel
                        htmlFor={`${idPrefix}-${option.value}`}
                        className="font-normal"
                    >
                        {option.label}
                    </FieldLabel>
                </Field>
            ))}
        </div>
    );
}
