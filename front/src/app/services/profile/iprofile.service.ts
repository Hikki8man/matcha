import { GenderEnum } from "src/app/enums/gender-enum";

export abstract class IProfileService {

    public abstract editName(name: string): Promise<void>;
    public abstract editGender(gender: GenderEnum): Promise<void>;

    public abstract isProfileCompleteGuard(): Promise<boolean>;
}