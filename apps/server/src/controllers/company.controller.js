import { Company } from '../models/Company.js';
import { Job } from '../models/Job.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';

export const getCompanies = async (req, res, next) => {
  try {
    const [companies, jobs] = await Promise.all([
      Company.find().sort({ createdAt: -1 }),
      Job.find({}, 'companyName status updatedAt createdAt'),
    ]);

    // Build drive statistics per company name
    const jobStatsMap = new Map();
    jobs.forEach((job) => {
      const nameKey = (job.companyName || '').trim().toLowerCase();
      if (!jobStatsMap.has(nameKey)) {
        jobStatsMap.set(nameKey, { total: 0, active: 0, latestDate: job.updatedAt || job.createdAt });
      }
      const stat = jobStatsMap.get(nameKey);
      stat.total += 1;
      if (job.status === 'ACTIVE') {
        stat.active += 1;
      }
      const jobDate = new Date(job.updatedAt || job.createdAt);
      if (jobDate > new Date(stat.latestDate)) {
        stat.latestDate = jobDate;
      }
    });

    const enrichedCompanies = companies.map((comp) => {
      const key = (comp.name || '').trim().toLowerCase();
      const stats = jobStatsMap.get(key) || { total: 0, active: 0, latestDate: comp.updatedAt || comp.createdAt };
      return {
        _id: comp._id,
        name: comp.name,
        industry: comp.industry || 'Information Technology',
        recruiterName: comp.recruiterName || 'Talent Acquisition',
        recruiterEmail: comp.recruiterEmail || `careers@${comp.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        recruiterPhone: comp.recruiterPhone || '+91 98000 00000',
        website: comp.website || '',
        location: comp.location || '',
        notes: comp.notes || '',
        activeDrivesCount: stats.active,
        totalDrivesCount: stats.total,
        lastActivity: new Date(stats.latestDate).toLocaleDateString(),
        createdAt: comp.createdAt,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        companies: enrichedCompanies,
        total: enrichedCompanies.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      throw new NotFoundError('Company not found');
    }
    res.status(200).json({
      success: true,
      data: { company },
    });
  } catch (error) {
    next(error);
  }
};

export const createCompany = async (req, res, next) => {
  try {
    const { name, industry, recruiterName, recruiterEmail, recruiterPhone, website, location, notes } = req.body;

    if (!name || !name.trim()) {
      throw new BadRequestError('Company name is required');
    }

    const trimmedName = name.trim();
    const existing = await Company.findOne({
      name: { $regex: new RegExp(`^${trimmedName}$`, 'i') },
    });

    if (existing) {
      throw new BadRequestError(`Company "${trimmedName}" is already registered`);
    }

    const company = await Company.create({
      name: trimmedName,
      industry: industry?.trim() || 'Information Technology',
      recruiterName: recruiterName?.trim() || '',
      recruiterEmail: recruiterEmail?.trim() || '',
      recruiterPhone: recruiterPhone?.trim() || '',
      website: website?.trim() || '',
      location: location?.trim() || '',
      notes: notes?.trim() || '',
      createdBy: req.user?._id,
    });

    res.status(201).json({
      success: true,
      data: { company },
      message: 'Company registered successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updateCompany = async (req, res, next) => {
  try {
    const { name, industry, recruiterName, recruiterEmail, recruiterPhone, website, location, notes } = req.body;

    const company = await Company.findById(req.params.id);
    if (!company) {
      throw new NotFoundError('Company not found');
    }

    if (name && name.trim() !== company.name) {
      const existing = await Company.findOne({
        _id: { $ne: company._id },
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      });
      if (existing) {
        throw new BadRequestError(`Company "${name.trim()}" already exists`);
      }
      company.name = name.trim();
    }

    if (industry !== undefined) company.industry = industry;
    if (recruiterName !== undefined) company.recruiterName = recruiterName;
    if (recruiterEmail !== undefined) company.recruiterEmail = recruiterEmail;
    if (recruiterPhone !== undefined) company.recruiterPhone = recruiterPhone;
    if (website !== undefined) company.website = website;
    if (location !== undefined) company.location = location;
    if (notes !== undefined) company.notes = notes;

    await company.save();

    res.status(200).json({
      success: true,
      data: { company },
      message: 'Company updated successfully',
    });
  } catch (error) {
    next(error);
  }
};
