import db from '../../database/connection';
import { About } from '../../types/about';

class AboutService {
  public aboutRepo = () => db<About>('about');

  public async getById(id: number) {
    return await this.aboutRepo().select('*').where('id', id).first();
  }

  public async editFrom(id: number, from: string) {
    return await this.aboutRepo().update('from', from).where('id', id);
  }

  public async editJob(id: number, job: string) {
    return await this.aboutRepo().update('job', job).where('id', id);
  }

  public async editStudies(id: number, studies: string) {
    return await this.aboutRepo().update('studies', studies).where('id', id);
  }

  public async editLanguages(id: number, languages: string) {
    return await this.aboutRepo()
      .update('languages', languages)
      .where('id', id);
  }

  public async editSmoking(id: number, smoking: string) {
    return await this.aboutRepo().update('smoking', smoking).where('id', id);
  }

  public async editDrinking(id: number, drinking: string) {
    return await this.aboutRepo().update('drinking', drinking).where('id', id);
  }

  public async editDrugs(id: number, drugs: string) {
    return await this.aboutRepo().update('drugs', drugs).where('id', id);
  }
}
export default new AboutService();
