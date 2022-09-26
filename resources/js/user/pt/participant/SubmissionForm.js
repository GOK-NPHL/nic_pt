import React from 'react'
import ReactDOM from 'react-dom';
import { FetchUserSamples, FetchReadnessSurvey, SubmitPT, GetSubmission } from '../../../components/utils/Helpers';

function SubmissionForm() {
    const [samples, setSamples] = React.useState([
        { id: 1, name: 'Sample 1' },
        { id: 2, name: 'Sample 2' },
        { id: 3, name: 'Sample 3' },
        { id: 4, name: 'Sample 4' },
        { id: 5, name: 'Sample 5' }
    ]);
    const [formResults, setFormResults] = React.useState({});
    const [shipId, setShipID] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [status, setStatus] = React.useState({});
    const [data, setData] = React.useState(null);








    React.useEffect(() => {
        setLoading(true);
        // get the ship id from the url using matchPath
        if (typeof window !== 'undefined') {
            const shipId = window.location.pathname.split('/')[2];
            setShipID(shipId);
            if (shipId) {
                FetchUserSamples(shipId).then((data) => {
                    if (data.status && data.status !== 200) {
                        setStatus({
                            type: 'danger',
                            message: data['Message'] || data?.data['Message'] || 'Something went wrong. Please try again later.'
                        });
                    } else {
                        if (data && (!data?.readiness_approval_id || data?.readiness_approval_id == null)) {
                            setStatus({
                                type: 'warning',
                                message: 'Please check that the readiness checklist has been filled & approved.'
                            });
                        } else {
                            if (data && data?.form_submission_id && data?.form_submission_id != null) {
                                setData(data);
                                setSamples(Array.from(data.samples, s => { return { id: s.sample_id, name: s.sample_name } }));
                                GetSubmission(data?.form_submission_id).then((rsp) => {
                                    // edit mode
                                    setFormResults({
                                        ...rsp.data.result,
                                        form_submission_id: data?.form_submission_id
                                    });
                                });
                                setLoading(false);
                            } else {
                                setData(data);
                                setSamples(Array.from(data.samples, s => { return { id: s.sample_id, name: s.sample_name } }));
                                setFormResults({ ...formResults, submission_deadline_date: data.end_date, dispatch_date: data.start_date });
                                setLoading(false);
                            }
                        }
                    }
                    setLoading(false);
                });
            } else {
                // FetchUserSamples().then((data) => {
                //     setData(data);
                //     setLoading(false);
                // });
            }

            /// autoselect
            $('#assay_2_dropdown').selectpicker();
        }
    }, []);

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        // if (name.includes('sample')) {
        //     const sampleId = name.split('_')[1];
        //     const sample = samples.find(sample => sample.id == sampleId);
        //     sample[name.split('_')[2]] = value;
        // }
        setFormResults({ ...formResults, [name]: value });
    }

    const methods = [
        { id: 1, name: 'Method 1' },
        { id: 2, name: 'Method 2' },
        { id: 3, name: 'Method 3' }
    ];

    const dataDictionary = {
        "interpretation_options": [
            {
                name: "SARS-CoV-2 detected",
                id: "sars_cov_2_detected",
            },
            {
                name: "SARS-CoV-2 NOT detected",
                id: "sars_cov_2_not_detected",
            },
            {
                name: "229E detected",
                id: "229e_detected",
            },
            {
                name: "HKU1 detected",
                id: "hku1_detected",
            },
            {
                name: "MERS-CoV dectected",
                id: "mers_cov_dectected",
            },
            {
                name: "NL63 detected",
                id: "nl63_detected",
            },
            {
                name: "OC43 detected",
                id: "oc43_detected",
            },
            {
                name: "SARS-CoV detected",
                id: "sars_cov_detected",
            },
            {
                name: "Negative",
                id: "negative",
            },
            {
                name: "Others (please type in free text)",
                id: "others",
            },
        ],
        "conventional_real-time-options": [
            {
                "name": "Conventional PCR",
                "id": "Conventional PCR"
            },
            {
                "name": "Real-time PCR",
                "id": "Real-time PCR"
            },
            {
                "name": "Real-time PCR (Multiplex)",
                "id": "Real-time PCR (Multiplex)"
            }
        ],
        "in-house_commercial-options": [
            {
                "name": "In-house",
                "id": "In-house"
            },
            {
                "name": "Commercial",
                "id": "Commercial"
            }
        ],
        "assay-options": [
            {
                "name": "1. Own design: please type in free text",
                "id": "1. Own design: please type in free text"
            },
            {
                "name": "2. Protocols shared by WHO (not indicative of preference, order by country):",
                "id": "2. Protocols shared by WHO (not indicative of preference, order by country):"
            },
            {
                "name": "China CDC, China",
                "id": "China CDC, China"
            },
            {
                "name": "Institut Pasteur, Paris, France",
                "id": "Institut Pasteur, Paris, France"
            },
            {
                "name": "Charité, Germany",
                "id": "Charité, Germany"
            },
            {
                "name": "HKU, Hong Kong SAR",
                "id": "HKU, Hong Kong SAR"
            },
            {
                "name": "National Institute of Infectious Diseases, Japan",
                "id": "National Institute of Infectious Diseases, Japan"
            },
            {
                "name": "National Institute of Health, Thailand",
                "id": "National Institute of Health, Thailand"
            },
            {
                "name": "US CDC, USA",
                "id": "US CDC, USA"
            }
        ],
        "assay-options-2": [
            {
                "name": "1drop Inc. 1copy™ COVID-19 qPCR Kit (CE-IVD) ",
                "id": "1drop_inc_1copy_covid_19_qpcr_kit_ce_ivd_56"
            },
            {
                "name": "3B BlackBio Biotech India Ltd TRUPCR®SARS-CoV-2 RT qPCR Kit (IVD India) ",
                "id": "3b_blackbio_biotech_india_ltd_trupcrsars_cov_2_rt_qpcr_kit_ivd_india_100"
            },
            {
                "name": "3D Medicines 3DMed 2019-nCoV RT-qPCR Detection Kit (RUO) ",
                "id": "3d_medicines_3dmed_2019_ncov_rt_qpcr_detection_kit_ruo_53"
            },
            {
                "name": "3D Medicines ANDiS® SARS-CoV-2 RT-qPCR Detection Kit (US FDA-EUA - CE-IVD) ",
                "id": "3d_medicines_andis_sars_cov_2_rt_qpcr_detection_kit_us_fda_eua___ce_ivd_1"
            },
            {
                "name": "A*ccelerate Technology A*STAR Fortitude Kit 2.0 (Singapore HSA) ",
                "id": "a_ccelerate_technology_a_star_fortitude_kit_20_singapore_hsa_92"
            },
            {
                "name": "AB ANALITICA srl REALQUALITY RQ-2019-nCoV (CE-IVD) ",
                "id": "ab_analitica_srl_realquality_rq_2019_ncov_ce_ivd_39"
            },
            {
                "name": "AB ANALITICA srl REALQUALITY RQ-SARS-CoV-2 (RUO) ",
                "id": "ab_analitica_srl_realquality_rq_sars_cov_2_ruo_98"
            },
            {
                "name": "Abacus Diagnostica GenomEra SARS-CoV-2 (RUO) ",
                "id": "abacus_diagnostica_genomera_sars_cov_2_ruo_76"
            },
            {
                "name": "Abbott Diagnostics Inc. ID NOW COVID-19 (US FDA-EUA) ",
                "id": "abbott_diagnostics_inc_id_now_covid_19_us_fda_eua_39"
            },
            {
                "name": "Abbott Molecular Inc. Abbott RealTime SARS-CoV-2 EUA test (US FDA-EUA - CE-IVD) ",
                "id": "abbott_molecular_inc_abbott_realtime_sars_cov_2_eua_test_us_fda_eua___ce_ivd_76"
            },
            {
                "name": "Absea Biotechnology Ltd The non-invasive MEGA test of SARS-CoV-2 (mucosal swabs) (in development) ",
                "id": "absea_biotechnology_ltd_the_non_invasive_mega_test_of_sars_cov_2_mucosal_swabs_in_development_38"
            },
            {
                "name": "Abwiz Bio RabWiz Ultra Sensitive COIV-19 Viral Antigen Test Kit (ELISA) (in development) ",
                "id": "abwiz_bio_rabwiz_ultra_sensitive_coiv_19_viral_antigen_test_kit_elisa_in_development_55"
            },
            {
                "name": "Academia Sinica Anti-SARS-CoV-2 nucleocapsid protein human IgM/IgG rapid detection kit (In development) ",
                "id": "academia_sinica_anti_sars_cov_2_nucleocapsid_protein_human_igm_igg_rapid_detection_kit_in_development_42"
            },
            {
                "name": "Access Bio Korea, Inc. CareStart™ COVID-19 IgM/IgG (in developement) ",
                "id": "access_bio_korea_inc_carestart_covid_19_igm_igg_in_developement_74"
            },
            {
                "name": "AccuBioTech Co. Ltd Accu-Tell COVID-19 IgG/IgM Rapid Test Cassette (CE-IVD) ",
                "id": "accubiotech_co_ltd_accu_tell_covid_19_igg_igm_rapid_test_cassette_ce_ivd_39"
            },
            {
                "name": "Acumen Research Laboratories Pte Ltd Acu-Corona 2.0 (Singapore HSA) ",
                "id": "acumen_research_laboratories_pte_ltd_acu_corona_20_singapore_hsa_95"
            },
            {
                "name": "Acumen Research Laboratories Pte Ltd Acu-Corona (RUO) ",
                "id": "acumen_research_laboratories_pte_ltd_acu_corona_ruo_34"
            },
            {
                "name": "ADT Biotech LyteStar 2019-nCoV RT-PCR Kit 1.0 (RUO) ",
                "id": "adt_biotech_lytestar_2019_ncov_rt_pcr_kit_10_ruo_94"
            },
            {
                "name": "Advanced Molecular Diagnostics Zena Max – SARS-COV-2 Real Time PCR Detection Kit (CE-IVD) ",
                "id": "advanced_molecular_diagnostics_zena_max___sars_cov_2_real_time_pcr_detection_kit_ce_ivd_74"
            },
            {
                "name": "AITbiotech abTES COVID-19 qPCR I Kit (CE-IVD) ",
                "id": "aitbiotech_abtes_covid_19_qpcr_i_kit_ce_ivd_34"
            },
            {
                "name": "AIVD Biotech Inc. COVID-19 IgG/IgM Rapid Test (colloidal gold-based) (in development) ",
                "id": "aivd_biotech_inc_covid_19_igg_igm_rapid_test_colloidal_gold_based_in_development_97"
            },
            {
                "name": "Aldatu Biosciences PANDAA qDx SARS-CoV-2 (In development) ",
                "id": "aldatu_biosciences_pandaa_qdx_sars_cov_2_in_development_83"
            },
            {
                "name": "altona Diagnostics RealStar® SARS-CoV-2 RT-PCR Kit (RUO) ",
                "id": "altona_diagnostics_realstar_sars_cov_2_rt_pcr_kit_ruo_43"
            },
            {
                "name": "AmonMed Biotechnology Co., Ltd COVID-19 Antigen Test Kit (Rare Earth Nano Fluorescence Immunochromatography) (CE-IVD) ",
                "id": "amonmed_biotechnology_co_ltd_covid_19_antigen_test_kit_rare_earth_nano_fluorescence_immunochromatography_ce_ivd_16"
            },
            {
                "name": "AmonMed Biotechnology Co., Ltd COVID-19 IgM/IgG test kit (Colloidal Gold) (CE-IVD) ",
                "id": "amonmed_biotechnology_co_ltd_covid_19_igm_igg_test_kit_colloidal_gold_ce_ivd_37"
            },
            {
                "name": "AmonMed Biotechnology Co., Ltd COVID-19 IgM/IgG test kit (Rare Earth Nano Fluorescence Immunochromatography) (CE-IVD) ",
                "id": "amonmed_biotechnology_co_ltd_covid_19_igm_igg_test_kit_rare_earth_nano_fluorescence_immunochromatography_ce_ivd_98"
            },
            {
                "name": "AmonMed Biotechnology Co., Ltd COVID-19/Influenza A virus/Influenza B virus IgM combo test kit (Rare Earth Nano Fluorescence Immunochromatography) (CE-IVD) ",
                "id": "amonmed_biotechnology_co_ltd_covid_19_influenza_a_virus_influenza_b_virus_igm_combo_test_kit_rare_earth_nano_fluorescence_immunochromatography_ce_ivd_100"
            },
            {
                "name": "AmonMed Biotechnology Co., Ltd COVID-19/Influenza A virus/Influenza B virus test kit (Rare Earth Nano Fluorescence Immunochromatography) (CE-IVD) ",
                "id": "amonmed_biotechnology_co_ltd_covid_19_influenza_a_virus_influenza_b_virus_test_kit_rare_earth_nano_fluorescence_immunochromatography_ce_ivd_63"
            },
            {
                "name": "Amoy Diagnostics Co., Ltd AmoyDx® Novel Coronavirus (2019 nCoV) Detection Kit (CE-IVD) ",
                "id": "amoy_diagnostics_co_ltd_amoydx_novel_coronavirus_2019_ncov_detection_kit_ce_ivd_85"
            },
            {
                "name": "Amplicon Ltd AmpliTest SARS-CoV-2 (Real Time PCR) (CE-IVD) ",
                "id": "amplicon_ltd_amplitest_sars_cov_2_real_time_pcr_ce_ivd_79"
            },
            {
                "name": "AmpliGene India Biotech Pvt. Ltd AmpEZ Rapid and sensitive Real time COVID-2019 test (RUO) ",
                "id": "ampligene_india_biotech_pvt_ltd_ampez_rapid_and_sensitive_real_time_covid_2019_test_ruo_72"
            },
            {
                "name": "Anatolia Geneworks Bosphore Novel Coronavirus (2019-nCoV) Detection Kit (lab-based) (CE-IVD) ",
                "id": "anatolia_geneworks_bosphore_novel_coronavirus_2019_ncov_detection_kit_lab_based_ce_ivd_45"
            },
            {
                "name": "Anbio (Xiamen) Biotechnology Co., Ltd COVID-19 Hybrid Capture Fluorescence Immunoassay Test (China FDA-EUA) ",
                "id": "anbio_xiamen_biotechnology_co_ltd_covid_19_hybrid_capture_fluorescence_immunoassay_test_china_fda_eua_82"
            },
            {
                "name": "Anhui Anlong Gene Technology Co., Ltd Detection Kit for 2019-nCov nucleic acid (Fluorescence PCR) (CE-IVD) ",
                "id": "anhui_anlong_gene_technology_co_ltd_detection_kit_for_2019_ncov_nucleic_acid_fluorescence_pcr_ce_ivd_72"
            },
            {
                "name": "Anhui Deep Blue Medical Technology Co., Ltd Colloidal gold strip for SARS-CoV-2 IgG & IgM (RUO) ",
                "id": "anhui_deep_blue_medical_technology_co_ltd_colloidal_gold_strip_for_sars_cov_2_igg___igm_ruo_58"
            },
            {
                "name": "Anhui Deep Blue Medical Technology Co., Ltd COVID-19 (SARS-CoV-2) IgG/IgM Antibody Test Kit (CE-IVD) ",
                "id": "anhui_deep_blue_medical_technology_co_ltd_covid_19_sars_cov_2_igg_igm_antibody_test_kit_ce_ivd_79"
            },
            {
                "name": "AniCon Labor GmbH Kylt® SARS-CoV-2 Confirmation RT-qPCR (CE-IVD) ",
                "id": "anicon_labor_gmbh_kylt_sars_cov_2_confirmation_rt_qpcr_ce_ivd_52"
            },
            {
                "name": "AniCon Labor GmbH Kylt® SARS-CoV-2 Screening RTU RT-qPCR (CE-IVD) ",
                "id": "anicon_labor_gmbh_kylt_sars_cov_2_screening_rtu_rt_qpcr_ce_ivd_22"
            },
            {
                "name": "Anlongen nConV-19 Nucleic Acid qPCR Kit (China FDA-EUA - CE-IVD) ",
                "id": "anlongen_nconv_19_nucleic_acid_qpcr_kit_china_fda_eua___ce_ivd_87"
            },
            {
                "name": "Anomalous Materials Pte Ltd 2019-nCoV IgG/IgM Rapid Testing Kit (CE-IVD) ",
                "id": "anomalous_materials_pte_ltd_2019_ncov_igg_igm_rapid_testing_kit_ce_ivd_89"
            },
            {
                "name": "Appolon Bioteck Detection Kit for 2019 Novel Coronavirus (2019-nCoV) RNA (PCR-Fluorescence Probing) (China FDA-EUA - CE-IVD) ",
                "id": "appolon_bioteck_detection_kit_for_2019_novel_coronavirus_2019_ncov_rna_pcr_fluorescence_probing_china_fda_eua___ce_ivd_100"
            },
            {
                "name": "Aptamer Group Ltd ADx SARS Co V-2 Virus Antigen Rapid Point of Care Test (in development) ",
                "id": "aptamer_group_ltd_adx_sars_co_v_2_virus_antigen_rapid_point_of_care_test_in_development_17"
            },
            {
                "name": "Assure Tech. (Hangzhou) Co., Ltd COVID-19 Antigen Rapid Test Device (in development) ",
                "id": "assure_tech_hangzhou_co_ltd_covid_19_antigen_rapid_test_device_in_development_26"
            },
            {
                "name": "Assure Tech. (Hangzhou) Co., Ltd COVID-19 IgG/IgM Rapid Test Device (CE-IVD) ",
                "id": "assure_tech_hangzhou_co_ltd_covid_19_igg_igm_rapid_test_device_ce_ivd_93"
            },
            {
                "name": "Atila BioSystems, Inc. Atila iAMP COVID-2019 Detection Kit (RUO) ",
                "id": "atila_biosystems_inc_atila_iamp_covid_2019_detection_kit_ruo_19"
            },
            {
                "name": "Ativa Medical Ativa Enhanced Screen (In development) ",
                "id": "ativa_medical_ativa_enhanced_screen_in_development_8"
            },
            {
                "name": "Attomarker Ltd Quantitative Immuno-kinetic assay for Covid-19 IgG+IgM+IgA for a multiantigen panel with CRP (automated) (in development) ",
                "id": "attomarker_ltd_quantitative_immuno_kinetic_assay_for_covid_19_igg_igm_iga_for_a_multiantigen_panel_with_crp_automated_in_development_30"
            },
            {
                "name": "Aura Biotechnologies Ltd Quick COVID-19 Colorimetric LAMP PCR (in development) ",
                "id": "aura_biotechnologies_ltd_quick_covid_19_colorimetric_lamp_pcr_in_development_5"
            },
            {
                "name": "Aura Biotechnologies Ltd Quick COVID-19 Realtime Multiplex PCR (in development) ",
                "id": "aura_biotechnologies_ltd_quick_covid_19_realtime_multiplex_pcr_in_development_27"
            },
            {
                "name": "Aurora Biomed Inc. SARS-COV-2 Detection Kit for the VERSA Viral Detection workstation (in development) ",
                "id": "aurora_biomed_inc_sars_cov_2_detection_kit_for_the_versa_viral_detection_workstation_in_development_36"
            },
            {
                "name": "AusDiagnostics SARS-CoV-2, Influenza and RSV 8-well (RUO) ",
                "id": "ausdiagnostics_sars_cov_2_influenza_and_rsv_8_well_ruo_7"
            },
            {
                "name": "Avioq Bio-Tech Co., Ltd Novel Coronavirus (2019-nCov)Antibody IgG/IgM Assay Kit (Colloidal Gold) (RUO) ",
                "id": "avioq_bio_tech_co_ltd_novel_coronavirus_2019_ncovantibody_igg_igm_assay_kit_colloidal_gold_ruo_26"
            },
            {
                "name": "Bai-care (Tianjin) Biotechnology Co., Ltd Multiplex Nucleic Acid Detection Kit for Respiratory Pathogens (CE-IVD) ",
                "id": "bai_care_tianjin_biotechnology_co_ltd_multiplex_nucleic_acid_detection_kit_for_respiratory_pathogens_ce_ivd_45"
            },
            {
                "name": "Baiya Phytopharm, Co, Ltd Baiya Rapid COVID-19 IgM/IgG test kit (in development) ",
                "id": "baiya_phytopharm_co_ltd_baiya_rapid_covid_19_igm_igg_test_kit_in_development_57"
            },
            {
                "name": "Bao Ruiyuan Biotech (Beijing) Co., Ltd. Novel Coronavivus(2019-nCov)Nucleic Acid Detection Kit-Multiple Fluorescence PCR (RUO) ",
                "id": "bao_ruiyuan_biotech_beijing_co_ltd_novel_coronavivus2019_ncovnucleic_acid_detection_kit_multiple_fluorescence_pcr_ruo_81"
            },
            {
                "name": "Beijing Abace Biology Co., Ltd COVID-19 Antibody (IgG/IgM)Test Kit (Colloidal Gold Immunochromatography) (CE-IVD) ",
                "id": "beijing_abace_biology_co_ltd_covid_19_antibody_igg_igmtest_kit_colloidal_gold_immunochromatography_ce_ivd_67"
            },
            {
                "name": "Beijing Abace Biology Co., Ltd COVID-19 IgG Antibody Test Kit (ELISA) (CE-IVD) ",
                "id": "beijing_abace_biology_co_ltd_covid_19_igg_antibody_test_kit_elisa_ce_ivd_9"
            },
            {
                "name": "Beijing Abace Biology Co., Ltd COVID-19 IgM Antibody Test Kit (ELISA) (CE-IVD) ",
                "id": "beijing_abace_biology_co_ltd_covid_19_igm_antibody_test_kit_elisa_ce_ivd_75"
            },
            {
                "name": "Beijing Abace Biology Co., Ltd COVID-19 Viral Antigen Test Kit (Colloidal Gold Immunochromatography) (CE-IVD) ",
                "id": "beijing_abace_biology_co_ltd_covid_19_viral_antigen_test_kit_colloidal_gold_immunochromatography_ce_ivd_26"
            },
            {
                "name": "Beijing Abace Biology Co., Ltd COVID-19 Viral Antigen Test Kit (ELISA) (CE-IVD) ",
                "id": "beijing_abace_biology_co_ltd_covid_19_viral_antigen_test_kit_elisa_ce_ivd_84"
            },
            {
                "name": "Beijing Applied Biological Technologies Co., Ltd Multiple Real-Time PCR Kit for Detection of 2019-nCoV (China FDA-EUA - CE-IVD) ",
                "id": "beijing_applied_biological_technologies_co_ltd_multiple_real_time_pcr_kit_for_detection_of_2019_ncov_china_fda_eua___ce_ivd_39"
            },
            {
                "name": "Beijing Beier Bioengineering Co., Ltd Multiple Real-time PCR kit for Detection of SARS-CoV-2 RNA (in development) ",
                "id": "beijing_beier_bioengineering_co_ltd_multiple_real_time_pcr_kit_for_detection_of_sars_cov_2_rna_in_development_66"
            },
            {
                "name": "Beijing Biochem Hengye Science & Technology Development Co., Ltd SARS-CoV-2 Real-Time RT-PCR Kit (RUO) ",
                "id": "beijing_biochem_hengye_science___technology_development_co_ltd_sars_cov_2_real_time_rt_pcr_kit_ruo_57"
            },
            {
                "name": "Beijing Bohui Innovation Biotechnology Automated SarS-CoV-2 NAT (RUO) ",
                "id": "beijing_bohui_innovation_biotechnology_automated_sars_cov_2_nat_ruo_18"
            },
            {
                "name": "Beijing Bohui Innovation Biotechnology Fully Automated 26 Plex RES Panel Assay (RUO) ",
                "id": "beijing_bohui_innovation_biotechnology_fully_automated_26_plex_res_panel_assay_ruo_3"
            },
            {
                "name": "Beijing Diagreat Biotechnologies Co., Ltd 2019-nCoV IgG Antibody Determination Kit (CE-IVD) ",
                "id": "beijing_diagreat_biotechnologies_co_ltd_2019_ncov_igg_antibody_determination_kit_ce_ivd_42"
            },
            {
                "name": "Beijing Diagreat Biotechnologies Co., Ltd 2019-nCoV IgM Antibody Determination Kit (CE-IVD) ",
                "id": "beijing_diagreat_biotechnologies_co_ltd_2019_ncov_igm_antibody_determination_kit_ce_ivd_96"
            },
            {
                "name": "Beijing Genskey Medical Technology Co., Ltd SARS-CoV-2 Nucleic Acid Detection Kit (RT-qPCR with Taqman-Probe) (RUO) ",
                "id": "beijing_genskey_medical_technology_co_ltd_sars_cov_2_nucleic_acid_detection_kit_rt_qpcr_with_taqman_probe_ruo_12"
            },
            {
                "name": "Beijing Hotgen Biotech Co., Ltd Coronavirus disease (COVID-19) Antibody Test (Colloidal Gold) (CE-IVD) ",
                "id": "beijing_hotgen_biotech_co_ltd_coronavirus_disease_covid_19_antibody_test_colloidal_gold_ce_ivd_13"
            },
            {
                "name": "Beijing Hotgen Biotech Co., Ltd Coronavirus disease (COVID-19) Antibody Test (Enzyme-Linked Immunosorbent Assay) (CE-IVD) ",
                "id": "beijing_hotgen_biotech_co_ltd_coronavirus_disease_covid_19_antibody_test_enzyme_linked_immunosorbent_assay_ce_ivd_20"
            },
            {
                "name": "Beijing Hotgen Biotech Co., Ltd Coronavirus disease (COVID-19) Antibody Test (Up-converting Phosphor Technology) (CE-IVD) ",
                "id": "beijing_hotgen_biotech_co_ltd_coronavirus_disease_covid_19_antibody_test_up_converting_phosphor_technology_ce_ivd_34"
            },
            {
                "name": "Beijing Hotgen Biotech Co., Ltd Coronavirus disease(COVID-19) Nucleic Acid Test Kit (PCR-Fluorescent Probe Method) (CE-IVD) ",
                "id": "beijing_hotgen_biotech_co_ltd_coronavirus_diseasecovid_19_nucleic_acid_test_kit_pcr_fluorescent_probe_method_ce_ivd_60"
            },
            {
                "name": "Beijing Infervision Technology Co. Ltd InferRead CT Pneumonia (In development) ",
                "id": "beijing_infervision_technology_co_ltd_inferread_ct_pneumonia_in_development_76"
            },
            {
                "name": "Beijing Kewei Clinical Diagnostic Reagent Inc. Kewei COVID-19 Antigen ELISA Test Kit (CE-IVD) ",
                "id": "beijing_kewei_clinical_diagnostic_reagent_inc_kewei_covid_19_antigen_elisa_test_kit_ce_ivd_49"
            },
            {
                "name": "Beijing Kewei Clinical Diagnostic Reagent Inc. Kewei COVID-19 Antigen Rapid Test Kit (Colloidal Gold) (CE-IVD) ",
                "id": "beijing_kewei_clinical_diagnostic_reagent_inc_kewei_covid_19_antigen_rapid_test_kit_colloidal_gold_ce_ivd_27"
            },
            {
                "name": "Beijing Kewei Clinical Diagnostic Reagent Inc. Kewei COVID-19 Antigen Rapid Test Kit (Fluorescence) (CE-IVD) ",
                "id": "beijing_kewei_clinical_diagnostic_reagent_inc_kewei_covid_19_antigen_rapid_test_kit_fluorescence_ce_ivd_66"
            },
            {
                "name": "Beijing Kewei Clinical Diagnostic Reagent Inc. Kewei COVID-19 IgG ELISA Test Kit (CE-IVD) ",
                "id": "beijing_kewei_clinical_diagnostic_reagent_inc_kewei_covid_19_igg_elisa_test_kit_ce_ivd_33"
            },
            {
                "name": "Beijing Kewei Clinical Diagnostic Reagent Inc. Kewei COVID-19 IgG/IgM Rapid Test Kit (Colloidal Gold) (CE-IVD) ",
                "id": "beijing_kewei_clinical_diagnostic_reagent_inc_kewei_covid_19_igg_igm_rapid_test_kit_colloidal_gold_ce_ivd_66"
            },
            {
                "name": "Beijing Kewei Clinical Diagnostic Reagent Inc. Kewei COVID-19 IgG/IgM Rapid Test Kit (Fluorescence) (CE-IVD) ",
                "id": "beijing_kewei_clinical_diagnostic_reagent_inc_kewei_covid_19_igg_igm_rapid_test_kit_fluorescence_ce_ivd_41"
            },
            {
                "name": "Beijing Kewei Clinical Diagnostic Reagent Inc. Kewei COVID-19 IgM ELISA Test Kit (CE-IVD) ",
                "id": "beijing_kewei_clinical_diagnostic_reagent_inc_kewei_covid_19_igm_elisa_test_kit_ce_ivd_47"
            },
            {
                "name": "Beijing Kinhawk Pharmaceutical Co., Ltd 2019-nCoV ORF1ab/N Gene Detection Kit (Fluorescence PCR Method) (RUO) ",
                "id": "beijing_kinhawk_pharmaceutical_co_ltd_2019_ncov_orf1ab_n_gene_detection_kit_fluorescence_pcr_method_ruo_51"
            },
            {
                "name": "Beijing Microread Genetics Co.,Ltd COVID-19 (SARS-CoV-2) Detection Kit (LAMP) - lab-based or near-POC (CE-IVD) ",
                "id": "beijing_microread_genetics_co_ltd_covid_19_sars_cov_2_detection_kit_lamp___lab_based_or_near_poc_ce_ivd_42"
            },
            {
                "name": "Beijing NaGene Diagnosis Reagent Co., Ltd Multiple Real-Time PCR kit for Detection of 2019-nCoV (RUO) ",
                "id": "beijing_nagene_diagnosis_reagent_co_ltd_multiple_real_time_pcr_kit_for_detection_of_2019_ncov_ruo_2"
            },
            {
                "name": "Beijing Savant Biotechnology Co., Ltd SARS-Cov-2 Antigen Fluorescence Rapid Detection Kit (CE-IVD) ",
                "id": "beijing_savant_biotechnology_co_ltd_sars_cov_2_antigen_fluorescence_rapid_detection_kit_ce_ivd_13"
            },
            {
                "name": "Beijing Tigsun Diagnostics Co. Ltd Tigsun COVID-19 Combo IgM/IgG Rapid Test (Lateral Flow Method) (CE-IVD) ",
                "id": "beijing_tigsun_diagnostics_co_ltd_tigsun_covid_19_combo_igm_igg_rapid_test_lateral_flow_method_ce_ivd_51"
            },
            {
                "name": "Beijing Wantai Biological Pharmacy Enterprise Co., Ltd Wantai SARS-CoV-2 Ab ELISA (RUO) ",
                "id": "beijing_wantai_biological_pharmacy_enterprise_co_ltd_wantai_sars_cov_2_ab_elisa_ruo_63"
            },
            {
                "name": "Beijing Wantai Biological Pharmacy Enterprise Co., Ltd Wantai SARS-CoV-2 Ab Rapid Test (RUO) ",
                "id": "beijing_wantai_biological_pharmacy_enterprise_co_ltd_wantai_sars_cov_2_ab_rapid_test_ruo_13"
            },
            {
                "name": "Beijing Wantai Biological Pharmacy Enterprise Co., Ltd Wantai SARS-CoV-2 IgM ELISA (RUO) ",
                "id": "beijing_wantai_biological_pharmacy_enterprise_co_ltd_wantai_sars_cov_2_igm_elisa_ruo_17"
            },
            {
                "name": "Beijing Wantai Biological Pharmacy Enterprise Co., Ltd Wantai SARS-CoV-2 RT-PCR Kit (RUO) ",
                "id": "beijing_wantai_biological_pharmacy_enterprise_co_ltd_wantai_sars_cov_2_rt_pcr_kit_ruo_31"
            },
            {
                "name": "BGI Health (HK) Co. Ltd. Real-time fluorescent RT-PCR kit for detecting 2019 nCoV (China FDA-EUA) ",
                "id": "bgi_health_hk_co_ltd_real_time_fluorescent_rt_pcr_kit_for_detecting_2019_ncov_china_fda_eua_85"
            },
            {
                "name": "Biocan Diagnostics Inc. Tell Me Fast Novel Coronavirus (COVID-19) IgG/IgM Ab Test (CE-IVD) ",
                "id": "biocan_diagnostics_inc_tell_me_fast_novel_coronavirus_covid_19_igg_igm_ab_test_ce_ivd_89"
            },
            {
                "name": "Bioeksen R&D Technologies Bio-Speedy SARS-CoV-2 (2019-nCoV) qPCR Detection Kit (CE-IVD) ",
                "id": "bioeksen_r_d_technologies_bio_speedy_sars_cov_2_2019_ncov_qpcr_detection_kit_ce_ivd_53"
            },
            {
                "name": "BioFire Defense, LLC BioFire COVID-19 Test (US FDA-EUA) ",
                "id": "biofire_defense_llc_biofire_covid_19_test_us_fda_eua_9"
            },
            {
                "name": "BIOHIT HealthCare (Hefei) Co., Ltd SARS-CoV-2 IgM/IgG antibody test kit (Colloidal Gold Method) (CE-IVD) ",
                "id": "biohit_healthcare_hefei_co_ltd_sars_cov_2_igm_igg_antibody_test_kit_colloidal_gold_method_ce_ivd_76"
            },
            {
                "name": "Biolidics Ltd 2019-nCoV IgG/IgM Antibody Detection Kit (Singapore HSA - CE-IVD) ",
                "id": "biolidics_ltd_2019_ncov_igg_igm_antibody_detection_kit_singapore_hsa___ce_ivd_6"
            },
            {
                "name": "BIOMAXIMA S.A. 2019-nCoV IgG/IgM Rapid Test Cassette (CE-IVD) ",
                "id": "biomaxima_sa_2019_ncov_igg_igm_rapid_test_cassette_ce_ivd_95"
            },
            {
                "name": "BIOMAXIMA S.A. SARS-CoV-2 Real Time PCR LAB-KIT™ (CE-IVD) ",
                "id": "biomaxima_sa_sars_cov_2_real_time_pcr_lab_kit_ce_ivd_57"
            },
            {
                "name": "BioMedomics, Inc. COVID-19 IgM-IgG Dual Antibody Rapid Test (CE-IVD) ",
                "id": "biomedomics_inc_covid_19_igm_igg_dual_antibody_rapid_test_ce_ivd_6"
            },
            {
                "name": "Biomeme COVID-19 Go Strips (RUO)",
                "id": "biomeme_covid_19_go_strips_ruo70"
            },
            {
                "name": "bioMérieux SA SARS-COV-2 R-GENE® (ref 423717) (RUO) ",
                "id": "biomérieux_sa_sars_cov_2_r_gene_ref_423717_ruo_92"
            },
            {
                "name": "bioMérieux SA SARS-COV-2 R-GENE® (ref 432720) (CE-IVD) ",
                "id": "biomérieux_sa_sars_cov_2_r_gene_ref_432720_ce_ivd_19"
            },
            {
                "name": "BIONEER Corporation AccuPower® COVID-19 Real-Time RT-PCR kit (lab-based automated kit: NCV-1111) (CE-IVD) ",
                "id": "bioneer_corporation_accupower_covid_19_real_time_rt_pcr_kit_lab_based_automated_kit__ncv_1111_ce_ivd_7"
            },
            {
                "name": "BIONEER Corporation AccuPower® SARS-CoV-2 Real-Time RT-PCR kit (manual kit: SCV-2122) (CE-IVD) ",
                "id": "bioneer_corporation_accupower_sars_cov_2_real_time_rt_pcr_kit_manual_kit__scv_2122_ce_ivd_51"
            },
            {
                "name": "Bioneer Inc., part of BIONEER Corp. SCVR-2122 AccuPower®SARS-CoV-2 Real-Time RT-PCR Kit (50 tests) (RUO) ",
                "id": "bioneer_inc_part_of_bioneer_corp_scvr_2122_accupowersars_cov_2_real_time_rt_pcr_kit_50_tests_ruo_18"
            },
            {
                "name": "Biotech & Biomedicine (Shenyang) Group Ltd Colorimetric and Isothermal Detection Kit for COVID-19 Coronavirus (CE-IVD) ",
                "id": "biotech___biomedicine_shenyang_group_ltd_colorimetric_and_isothermal_detection_kit_for_covid_19_coronavirus_ce_ivd_26"
            },
            {
                "name": "Biotech & Biomedicine (Shenyang) Group Ltd Real Time PCR Detection Kit For COVID-19 Coronavirus (CE-IVD) ",
                "id": "biotech___biomedicine_shenyang_group_ltd_real_time_pcr_detection_kit_for_covid_19_coronavirus_ce_ivd_97"
            },
            {
                "name": "Bio-Techne Ella / Simple Plex COVID-19 16×4 Standard Panel (RUO) ",
                "id": "bio_techne_ella___simple_plex_covid_19_16_4_standard_panel_ruo_89"
            },
            {
                "name": "BIOTECON Diagnostics GmbH Acu-CoronaTM 2.0/3.0 SARS-CoV-2 Real-time PCR Kits (RUO) ",
                "id": "biotecon_diagnostics_gmbh_acu_coronatm_20_30_sars_cov_2_real_time_pcr_kits_ruo_88"
            },
            {
                "name": "BIOTECON Diagnostics GmbH microproof SARS-CoV-2 Screening/Identification Kits (RUO) ",
                "id": "biotecon_diagnostics_gmbh_microproof_sars_cov_2_screening_identification_kits_ruo_81"
            },
            {
                "name": "BIOTECON Diagnostics GmbH virusproof SL SARS-CoV-2 Real-time PCR Kit (RUO) ",
                "id": "biotecon_diagnostics_gmbh_virusproof_sl_sars_cov_2_real_time_pcr_kit_ruo_8"
            },
            {
                "name": "BluSense Diagnostics ApS ViroTrack COVID IgA+IgM/IgG/Total Ig Ab (RUO) ",
                "id": "blusense_diagnostics_aps_virotrack_covid_iga_igm_igg_total_ig_ab_ruo_57"
            },
            {
                "name": "Boditech Inc. ExAmplar COVID-19 real-time PCR kit (L) (RUO) ",
                "id": "boditech_inc_examplar_covid_19_real_time_pcr_kit_l_ruo_85"
            },
            {
                "name": "Boditech Med, Inc. AFIAS COVID-19 Ab, IgM/IgG (automated) (RUO) ",
                "id": "boditech_med_inc_afias_covid_19_ab_igm_igg_automated_ruo_13"
            },
            {
                "name": "Boditech Med, Inc. AFIAS COVID-19, Viral Antigen (automated) (RUO) ",
                "id": "boditech_med_inc_afias_covid_19_viral_antigen_automated_ruo_50"
            },
            {
                "name": "Boditech Med, Inc. Ichroma COVID-19, viral antigen (manual) (RUO) ",
                "id": "boditech_med_inc_ichroma_covid_19_viral_antigen_manual_ruo_71"
            },
            {
                "name": "Boditech Med, Inc. Ichromia COVID-19 Ab, IgM/IgG (manual) (RUO) ",
                "id": "boditech_med_inc_ichromia_covid_19_ab_igm_igg_manual_ruo_64"
            },
            {
                "name": "Bright Line Research Rona 19 Screen Coronavirus (SARS-CoV-2) IgG/IgM Rapid Test (in development) ",
                "id": "bright_line_research_rona_19_screen_coronavirus_sars_cov_2_igg_igm_rapid_test_in_development_87"
            },
            {
                "name": "BTNX Inc. Rapid Response COVID-19 IgG/IgM Test Cassette (Whole Blood/Serum/Plasma) (RUO) ",
                "id": "btnx_inc_rapid_response_covid_19_igg_igm_test_cassette_whole_blood_serum_plasma_ruo_8"
            },
            {
                "name": "Camtech Diagnostics Pte Ltd Camtech COVID-19 Rapid Test Kit ",
                "id": "camtech_diagnostics_pte_ltd_camtech_covid_19_rapid_test_kit_79"
            },
            {
                "name": "Canary Health Technologies AiroStotleCV19 (Breath VOCs) (In development) ",
                "id": "canary_health_technologies_airostotlecv19_breath_vocs_in_development_19"
            },
            {
                "name": "Cancer Rop Co., Ltd. Q-Sens® 2019-nCoV Detection Kit (CE-IVD) ",
                "id": "cancer_rop_co_ltd_q_sens_2019_ncov_detection_kit_ce_ivd_8"
            },
            {
                "name": "Canvax Biotech qMAXSentm Coronavirus (SARS-CoV-2) RT-qPCR Detection Kit (WHO EU) ",
                "id": "canvax_biotech_qmaxsentm_coronavirus_sars_cov_2_rt_qpcr_detection_kit_who_eu_96"
            },
            {
                "name": "CapitalBio Technology Respiratory Virus Nucleic Acid Detection Kit (Isothermal Amplification Chip Method) (automated near-POC NAT - China-FDA) ",
                "id": "capitalbio_technology_respiratory_virus_nucleic_acid_detection_kit_isothermal_amplification_chip_method_automated_near_poc_nat___china_fda_35"
            },
            {
                "name": "Caspr Biotech Phantom 1.0 Dx (near-POC) (In development) ",
                "id": "caspr_biotech_phantom_10_dx_near_poc_in_development_41"
            },
            {
                "name": "Cellex Inc. Cellex qSARS-CoV-2 IgGIgM Cassette Rapid Test (US FDA-EUA - CE-IVD) ",
                "id": "cellex_inc_cellex_qsars_cov_2_iggigm_cassette_rapid_test_us_fda_eua___ce_ivd_57"
            },
            {
                "name": "CellSafe FastRT-qPCR COVID19 detection kit (RUO) ",
                "id": "cellsafe_fastrt_qpcr_covid19_detection_kit_ruo_40"
            },
            {
                "name": "CellSafe Qplex COVID-19 RT-qLAMP Assay (RUO) ",
                "id": "cellsafe_qplex_covid_19_rt_qlamp_assay_ruo_31"
            },
            {
                "name": "CellSafe UltrFast RT-qLAMP COVID19 Detection kit (RUO) ",
                "id": "cellsafe_ultrfast_rt_qlamp_covid19_detection_kit_ruo_4"
            },
            {
                "name": "Cepheid Xpert Xpress SARS-CoV-2 (US FDA-EUA) ",
                "id": "cepheid_xpert_xpress_sars_cov_2_us_fda_eua_67"
            },
            {
                "name": "CerTest Biotec, S.L. VIASURE SARS-CoV-2 Real Time PCR Detection Kit (CE-IVD) ",
                "id": "certest_biotec_sl_viasure_sars_cov_2_real_time_pcr_detection_kit_ce_ivd_70"
            },
            {
                "name": "CerTest Biotec, S.L. VIASURE SARS-CoV-2 S gene Real Time PCR Detection Kit adapted for BD MAX™ System (CE-IVD) ",
                "id": "certest_biotec_sl_viasure_sars_cov_2_s_gene_real_time_pcr_detection_kit_adapted_for_bd_max_system_ce_ivd_26"
            },
            {
                "name": "CerTest Biotec, S.L. VIASURE SARS-CoV-2 S gene Real Time PCR Detection Kit (CE-IVD) ",
                "id": "certest_biotec_sl_viasure_sars_cov_2_s_gene_real_time_pcr_detection_kit_ce_ivd_80"
            },
            {
                "name": "Changsha Sinocare Inc. SARS-CoV-2 Antibody Test Strip (Colloidal Gold Method) (CE-IVD) ",
                "id": "changsha_sinocare_inc_sars_cov_2_antibody_test_strip_colloidal_gold_method_ce_ivd_86"
            },
            {
                "name": "Chaozhou Hybribio Biochemistry Ltd COVID-19 Real-Time PCR Kit (manual & automated lab-based) (CE-IVD) ",
                "id": "chaozhou_hybribio_biochemistry_ltd_covid_19_real_time_pcr_kit_manual___automated_lab_based_ce_ivd_61"
            },
            {
                "name": "Chengdu Fengji Biotechnology Co., Ltd of China 2019-nCoV Nucleic acid detection kit (multiplex PCR fluorescent probe method) (RUO) ",
                "id": "chengdu_fengji_biotechnology_co_ltd_of_china_2019_ncov_nucleic_acid_detection_kit_multiplex_pcr_fluorescent_probe_method_ruo_72"
            },
            {
                "name": "ChromaCode, Inc. ChromaCode COVID-19 Six Target Single Well Assay (RUO) ",
                "id": "chromacode_inc_chromacode_covid_19_six_target_single_well_assay_ruo_26"
            },
            {
                "name": "Clonit quanty-CONV-19 (CE-IVD) ",
                "id": "clonit_quanty_conv_19_ce_ivd_40"
            },
            {
                "name": "Co-diagnostics Logix Smart Coronavirus disease 2019 (COVID-19) (CE-IVD) ",
                "id": "co_diagnostics_logix_smart_coronavirus_disease_2019_covid_19_ce_ivd_59"
            },
            {
                "name": "Core Technology Co., Ltd COVID-19 IgM/IgG Ab Test (CE-IVD) ",
                "id": "core_technology_co_ltd_covid_19_igm_igg_ab_test_ce_ivd_18"
            },
            {
                "name": "Coris BioConcept COVID-19 Ag Respi-Strip (CE-IVD)",
                "id": "coris_bioconcept_covid_19_ag_respi_strip_ce_ivd44"
            },
            {
                "name": "Coyote Bioscience 2019-nCoV Prep Free QPCR Assay (near-POC) (In development) ",
                "id": "coyote_bioscience_2019_ncov_prep_free_qpcr_assay_near_poc_in_development_9"
            },
            {
                "name": "Creative Biolabs SARS-CoV-2 (2019-nCoV) Nucleoprotein Protein ELISA Kit (RUO) ",
                "id": "creative_biolabs_sars_cov_2_2019_ncov_nucleoprotein_protein_elisa_kit_ruo_98"
            },
            {
                "name": "Creative Biolabs SARS-CoV-2 (2019-nCoV) Spike Protein ELISA Kit (RUO) ",
                "id": "creative_biolabs_sars_cov_2_2019_ncov_spike_protein_elisa_kit_ruo_24"
            },
            {
                "name": "Creative Diagnostics SARS-CoV-2 Antigen ELISA Kit (RUO) ",
                "id": "creative_diagnostics_sars_cov_2_antigen_elisa_kit_ruo_49"
            },
            {
                "name": "Creative Diagnostics SARS-CoV-2 IgG ELISA Kit (RUO) ",
                "id": "creative_diagnostics_sars_cov_2_igg_elisa_kit_ruo_69"
            },
            {
                "name": "Creative Diagnostics SARS-CoV-2 IgM ELISA Kit (RUO) ",
                "id": "creative_diagnostics_sars_cov_2_igm_elisa_kit_ruo_28"
            },
            {
                "name": "Creative Diagnostics SARS-COV-2 Total Antibody ELISA Kit (RUO) ",
                "id": "creative_diagnostics_sars_cov_2_total_antibody_elisa_kit_ruo_26"
            },
            {
                "name": "Credo Diagnostics Biomedical VitaPCR COVID-19 assay (RUO) ",
                "id": "credo_diagnostics_biomedical_vitapcr_covid_19_assay_ruo_36"
            },
            {
                "name": "CTK Biotech, Inc. Aridia COVID-19 Real Time PCR Test (CE-IVD) ",
                "id": "ctk_biotech_inc_aridia_covid_19_real_time_pcr_test_ce_ivd_79"
            },
            {
                "name": "CTK Biotech, Inc. OnSite COVID-19 IgG/IgM Rapid Test (RUO) ",
                "id": "ctk_biotech_inc_onsite_covid_19_igg_igm_rapid_test_ruo_95"
            },
            {
                "name": "DAAN Gene Co., Ltd of Sun Yat-sen University Novel Coronavirus (2019-nCoV) Real Time Multiplex RT-PCR kit (China FDA–EUA - CE-IVD) ",
                "id": "daan_gene_co_ltd_of_sun_yat_sen_university_novel_coronavirus_2019_ncov_real_time_multiplex_rt_pcr_kit_china_fda_eua___ce_ivd_68"
            },
            {
                "name": "DART Diagnostics DART COVID-19 (manual) (in development) ",
                "id": "dart_diagnostics_dart_covid_19_manual_in_development_54"
            },
            {
                "name": "DIA PRO Diagnostic BioProbes Srl COV19G.CE - ELISA COVID 19 IgG (CE-IVD) ",
                "id": "dia_pro_diagnostic_bioprobes_srl_cov19gce___elisa_covid_19_igg_ce_ivd_15"
            },
            {
                "name": "DIA PRO Diagnostic BioProbes Srl COV19M.CE - ELISA COVID 19 IgM (CE-IVD) ",
                "id": "dia_pro_diagnostic_bioprobes_srl_cov19mce___elisa_covid_19_igm_ce_ivd_31"
            },
            {
                "name": "DIA.PRO Diagnostic Bioprobes Srl COV19CONF.CE - ELISA COVID 19 IgG Confirmatory (CE-IVD) ",
                "id": "diapro_diagnostic_bioprobes_srl_cov19confce___elisa_covid_19_igg_confirmatory_ce_ivd_20"
            },
            {
                "name": "Diagnostics for the Real World Ltd SAMBA II COVID-19 Test (near-POC NAT) (CE-IVD) ",
                "id": "diagnostics_for_the_real_world_ltd_samba_ii_covid_19_test_near_poc_nat_ce_ivd_91"
            },
            {
                "name": "DiaSorin Molecular, LLC Simplexa™ COVID-19 Direct RT-PCR Kit (CE-IVD)",
                "id": "diasorin_molecular_llc_simplexa_covid_19_direct_rt_pcr_kit_ce_ivd79"
            },
            {
                "name": "Diatheva SRL COVID-19 PCR DIATHEVA Detection kit (CE-IVD) ",
                "id": "diatheva_srl_covid_19_pcr_diatheva_detection_kit_ce_ivd_2"
            },
            {
                "name": "DNA Software, Inc. Upper Respiratory Virus Panel, multiplex PCR, COVID-19, Influenza A B (in development) ",
                "id": "dna_software_inc_upper_respiratory_virus_panel_multiplex_pcr_covid_19_influenza_a_b_in_development_50"
            },
            {
                "name": "DNA XPERTS XPERTS COVID19 - FAST RT-PCR KIT, Real time PCR kit for COVID19 detection (RUO) ",
                "id": "dna_xperts_xperts_covid19___fast_rt_pcr_kit_real_time_pcr_kit_for_covid19_detection_ruo_4"
            },
            {
                "name": "DRG International, Inc. COVID-19 lgG, EIA-6146 (CE-IVD) ",
                "id": "drg_international_inc_covid_19_lgg_eia_6146_ce_ivd_55"
            },
            {
                "name": "DRG International, Inc. COVID-19 lgM, EIA-6147 (CE-IVD) ",
                "id": "drg_international_inc_covid_19_lgm_eia_6147_ce_ivd_98"
            },
            {
                "name": "Dynamiker Biotechnology (Tianjin) Co., Ltd Novel Coronavirus(2019-nCov)RT-PCR Kit (RUO) ",
                "id": "dynamiker_biotechnology_tianjin_co_ltd_novel_coronavirus2019_ncovrt_pcr_kit_ruo_82"
            },
            {
                "name": "Dynamiker Biotechnology (Tianjin) Co., Ltd. 2019 nCOV IgG/IgM Rapid Test (CE-IVD) ",
                "id": "dynamiker_biotechnology_tianjin_co_ltd_2019_ncov_igg_igm_rapid_test_ce_ivd_15"
            },
            {
                "name": "Eagle Biosciences Inc. COVID-19 IgG ELISA Assay (RUO) ",
                "id": "eagle_biosciences_inc_covid_19_igg_elisa_assay_ruo_47"
            },
            {
                "name": "Eagle Biosciences Inc. COVID-19 IgM ELISA Assay (RUO) ",
                "id": "eagle_biosciences_inc_covid_19_igm_elisa_assay_ruo_33"
            },
            {
                "name": "Edinburgh Genetics Limited Edinburgh Genetics Complete Whole Blood Collection Kit (RUO) ",
                "id": "edinburgh_genetics_limited_edinburgh_genetics_complete_whole_blood_collection_kit_ruo_55"
            },
            {
                "name": "Edinburgh Genetics Limited Edinburgh Genetics COVID-19 Colloidal Gold Immunoassay Testing Kit, IgG/IgM Combined (CE-IVD) ",
                "id": "edinburgh_genetics_limited_edinburgh_genetics_covid_19_colloidal_gold_immunoassay_testing_kit_igg_igm_combined_ce_ivd_69"
            },
            {
                "name": "Edinburgh Genetics Limited Edinburgh Genetics COVID-19 Real-Time PCR Testing Kit (China FDA-EUA - CE-IVD) ",
                "id": "edinburgh_genetics_limited_edinburgh_genetics_covid_19_real_time_pcr_testing_kit_china_fda_eua___ce_ivd_21"
            },
            {
                "name": "Edinburgh Genetics Limited Edinburgh Genetics Virus Swab Sampling Kit (RUO) ",
                "id": "edinburgh_genetics_limited_edinburgh_genetics_virus_swab_sampling_kit_ruo_31"
            },
            {
                "name": "Elabscience Novel Coronavirus (SARS-CoV-2) Nucleic Acid Assay Kit (RT-PCR) (RUO) ",
                "id": "elabscience_novel_coronavirus_sars_cov_2_nucleic_acid_assay_kit_rt_pcr_ruo_47"
            },
            {
                "name": "Elabscience SARS-CoV-2 (2019-nCoV) IgG/IgM Lateral Flow Assay Kit (Whole Blood/ Serum/ Plasma) (RUO) ",
                "id": "elabscience_sars_cov_2_2019_ncov_igg_igm_lateral_flow_assay_kit_whole_blood__serum__plasma_ruo_77"
            },
            {
                "name": "Elisabeth Pharmacon spol. s.r.o. EliGene COVID19 BASIC A RT (CE-IVD) ",
                "id": "elisabeth_pharmacon_spol_sro_eligene_covid19_basic_a_rt_ce_ivd_13"
            },
            {
                "name": "Epitope Diagnostics, Inc. EDI™ Novel Coronavirus COVID-19 IgG ELISA Kit (CE-IVD) ",
                "id": "epitope_diagnostics_inc_edi_novel_coronavirus_covid_19_igg_elisa_kit_ce_ivd_83"
            },
            {
                "name": "Epitope Diagnostics, Inc. EDI™ Novel Coronavirus COVID-19 IgM ELISA Kit (CE-IVD) ",
                "id": "epitope_diagnostics_inc_edi_novel_coronavirus_covid_19_igm_elisa_kit_ce_ivd_6"
            },
            {
                "name": "Eryigit Endustriyel Makina ve Tibbi Cihazlar Senteligo Covid-19 qRT PCR Detection Kit (CE-IVD) ",
                "id": "eryigit_endustriyel_makina_ve_tibbi_cihazlar_senteligo_covid_19_qrt_pcr_detection_kit_ce_ivd_44"
            },
            {
                "name": "Eurobio Scientific EurobioPlex SARS-CoV-2 Multiplex (CE) ",
                "id": "eurobio_scientific_eurobioplex_sars_cov_2_multiplex_ce_50"
            },
            {
                "name": "EUROIMMUN AG Anti-SARS-CoV-2 ELISA (IgA) (manual, automated) (CE-IVD) ",
                "id": "euroimmun_ag_anti_sars_cov_2_elisa_iga_manual_automated_ce_ivd_22"
            },
            {
                "name": "EUROIMMUN AG Anti-SARS-CoV-2 ELISA (IgG) (manual, automated) (CE-IVD) ",
                "id": "euroimmun_ag_anti_sars_cov_2_elisa_igg_manual_automated_ce_ivd_17"
            },
            {
                "name": "EUROIMMUN AG EURORealTime SARS-CoV-2 (CE-IVD) ",
                "id": "euroimmun_ag_eurorealtime_sars_cov_2_ce_ivd_32"
            },
            {
                "name": "FABPulous/DTwist BV DTwist ",
                "id": "fabpulous_dtwist_bv_dtwist_67"
            },
            {
                "name": "Fast Track Diagnostics Luxembourg S.à r.l., a Siemens Healthineers Company FTD-114 SARS-CoV-2 (manual & lab-based NAT) (In development) ",
                "id": "fast_track_diagnostics_luxembourg_sà_rl_a_siemens_healthineers_company_ftd_114_sars_cov_2_manual___lab_based_nat_in_development_9"
            },
            {
                "name": "FemtoDx COVID-19 Antibody Test (in development) ",
                "id": "femtodx_covid_19_antibody_test_in_development_29"
            },
            {
                "name": "FemtoDx COVID-19 Rapid Home Nucleic Acid Test (in development) ",
                "id": "femtodx_covid_19_rapid_home_nucleic_acid_test_in_development_76"
            },
            {
                "name": "Fluxergy LLC Fluxergy Sample-to-Answer SARS-CoV-2 RT-PCR (In development) ",
                "id": "fluxergy_llc_fluxergy_sample_to_answer_sars_cov_2_rt_pcr_in_development_37"
            },
            {
                "name": "GenBody, Inc. GenBody COVID-19 IgM/IgG DUO (RUO) ",
                "id": "genbody_inc_genbody_covid_19_igm_igg_duo_ruo_80"
            },
            {
                "name": "GenBody, Inc. GenBody COVID-19 IgM/IgG (CE-IVD) ",
                "id": "genbody_inc_genbody_covid_19_igm_igg_ce_ivd_58"
            },
            {
                "name": "GenBody, Inc. GenBody FIA COVID-19 IgM/IgG (manual) (RUO) ",
                "id": "genbody_inc_genbody_fia_covid_19_igm_igg_manual_ruo_32"
            },
            {
                "name": "Gencurix Inc. GenePro COVID-19 Detection Test v2 (CE-IVD) ",
                "id": "gencurix_inc_genepro_covid_19_detection_test_v2_ce_ivd_95"
            },
            {
                "name": "Gencurix Inc. GenePro COVID-19 Detection Test (CE-IVD) ",
                "id": "gencurix_inc_genepro_covid_19_detection_test_ce_ivd_24"
            },
            {
                "name": "Gene Biosystems Gene Bio COVID-19 Qualitative Real Time PCR Kit Ver. 1.0 (RUO) ",
                "id": "gene_biosystems_gene_bio_covid_19_qualitative_real_time_pcr_kit_ver_10_ruo_2"
            },
            {
                "name": "genedrive plc Genedrive®96 SARS-CoV-2 Kit (In development) ",
                "id": "genedrive_plc_genedrive96_sars_cov_2_kit_in_development_37"
            },
            {
                "name": "GeneFirst Ltd Respiratory Pathogen Panel (RUO) ",
                "id": "genefirst_ltd_respiratory_pathogen_panel_ruo_8"
            },
            {
                "name": "GeneFirst Ltd The Novel Coronavirus (2019-nCoV) Nucleic Acid Test Kit (RUO) ",
                "id": "genefirst_ltd_the_novel_coronavirus_2019_ncov_nucleic_acid_test_kit_ruo_88"
            },
            {
                "name": "GeneMatrix Inc. NeoPlex COVID-19 Detection Kit (CE-IVD) ",
                "id": "genematrix_inc_neoplex_covid_19_detection_kit_ce_ivd_52"
            },
            {
                "name": "GeneMe Advanced One Step FAST Covi19 KIT Two Genes Set (CE-IVD) ",
                "id": "geneme_advanced_one_step_fast_covi19_kit_two_genes_set_ce_ivd_21"
            },
            {
                "name": "geneOmbio Technologies Pvt. Ltd geneOmbio COVID-19 rt-LAMP test (RUO) ",
                "id": "geneombio_technologies_pvt_ltd_geneombio_covid_19_rt_lamp_test_ruo_17"
            },
            {
                "name": "General Biologicals Corporation GB SARS-CoV-2 Real Time RT-PCR (RUO) ",
                "id": "general_biologicals_corporation_gb_sars_cov_2_real_time_rt_pcr_ruo_47"
            },
            {
                "name": "GeneReach Biotechnology Corporation POCKIT™ Central SARS-CoV-2 (orf 1ab) Premix Reagent (RUO) ",
                "id": "genereach_biotechnology_corporation_pockit_central_sars_cov_2_orf_1ab_premix_reagent_ruo_95"
            },
            {
                "name": "Genesystem, Co. Ltd SMARTCHECK SARS-CoV2 Detection Kit (RUO) ",
                "id": "genesystem_co_ltd_smartcheck_sars_cov2_detection_kit_ruo_7"
            },
            {
                "name": "GeneTex International Corporation ACE2 antibody [N1N2], N-term (GTX101395) (RUO) ",
                "id": "genetex_international_corporation_ace2_antibody_n1n2_n_term_gtx101395_ruo_3"
            },
            {
                "name": "GeneTex International Corporation SARS-CoV / SARS-CoV-2 (COVID-19) nucleocapsid antibody [6H3] (GTX632269)_ELISA (RUO) ",
                "id": "genetex_international_corporation_sars_cov___sars_cov_2_covid_19_nucleocapsid_antibody_6h3_gtx632269_elisa_ruo_72"
            },
            {
                "name": "GeneTex International Corporation SARS-CoV / SARS-CoV-2 (COVID-19) spike antibody [1A9] (GTX632604) (RUO) ",
                "id": "genetex_international_corporation_sars_cov___sars_cov_2_covid_19_spike_antibody_1a9_gtx632604_ruo_60"
            },
            {
                "name": "GeneTex International Corporation SARS-CoV-2 (COVID-19) nucleocapsid antibody (GTX135357)_ELISA (RUO) ",
                "id": "genetex_international_corporation_sars_cov_2_covid_19_nucleocapsid_antibody_gtx135357_elisa_ruo_100"
            },
            {
                "name": "GeneTex International Corporation SARS-CoV-2 (COVID-19) nucleocapsid protein (GTX135357-pro) (RUO) ",
                "id": "genetex_international_corporation_sars_cov_2_covid_19_nucleocapsid_protein_gtx135357_pro_ruo_96"
            },
            {
                "name": "GeneTex International Corporation SARS-CoV-2 (COVID-19) spike antibody (GTX135360)_ELISA (RUO) ",
                "id": "genetex_international_corporation_sars_cov_2_covid_19_spike_antibody_gtx135360_elisa_ruo_14"
            },
            {
                "name": "Genetic Signatures Limited EasyScreenTM Pan-Coronavirus/SARS-CoV-2 Detection Kit (RUO) ",
                "id": "genetic_signatures_limited_easyscreentm_pan_coronavirus_sars_cov_2_detection_kit_ruo_1"
            },
            {
                "name": "Genitech NSAN Pharmaceutical Pvt. Ltd COVID-19 IgG/IgM Rapid Test Cassette (Whole Blood/Serum/Plasma) (CE-IVD) ",
                "id": "genitech_nsan_pharmaceutical_pvt_ltd_covid_19_igg_igm_rapid_test_cassette_whole_blood_serum_plasma_ce_ivd_68"
            },
            {
                "name": "GenMark Diagnostics ePlex® SARS-CoV-2 Test (US-FDA EUA) ",
                "id": "genmark_diagnostics_eplex_sars_cov_2_test_us_fda_eua_46"
            },
            {
                "name": "GenomCan Inc. Fluorescent PCR Probe Detection Kit for SARS-CoV-2 (CE-IVD) ",
                "id": "genomcan_inc_fluorescent_pcr_probe_detection_kit_for_sars_cov_2_ce_ivd_48"
            },
            {
                "name": "Genomica Sau CLART COVID-19 (CE-IVD) ",
                "id": "genomica_sau_clart_covid_19_ce_ivd_24"
            },
            {
                "name": "Genomica Sau qCOVID-19 (CE-IVD) ",
                "id": "genomica_sau_qcovid_19_ce_ivd_56"
            },
            {
                "name": "Genomictree, Inc. AccuraTect RT-qPCR SARS-CoV-2 (CE-IVD) ",
                "id": "genomictree_inc_accuratect_rt_qpcr_sars_cov_2_ce_ivd_74"
            },
            {
                "name": "GenScript 2019-nCoV qRT-PCR Detection Assay (RUO) ",
                "id": "genscript_2019_ncov_qrt_pcr_detection_assay_ruo_27"
            },
            {
                "name": "Gensure Biotech, Inc. OZO Diamond - OZO SARS-CoV-2 IgM + IgG Method (CE-IVD) ",
                "id": "gensure_biotech_inc_ozo_diamond___ozo_sars_cov_2_igm___igg_method_ce_ivd_43"
            },
            {
                "name": "Gensure Biotech, Inc. OZO Gold - OZO SARS-CoV-2 IgG Method (CE-IVD) ",
                "id": "gensure_biotech_inc_ozo_gold___ozo_sars_cov_2_igg_method_ce_ivd_39"
            },
            {
                "name": "Gensure Biotech, Inc. OZO Silver - OZO SARS-CoV-2 IgM Method (CE-IVD) ",
                "id": "gensure_biotech_inc_ozo_silver___ozo_sars_cov_2_igm_method_ce_ivd_77"
            },
            {
                "name": "gerbion GmbH & Co., KG virellaSARS-CoV-2 seqc real time RT-PCR Kit 2.0 (CE-IVD) ",
                "id": "gerbion_gmbh___co_kg_virellasars_cov_2_seqc_real_time_rt_pcr_kit_20_ce_ivd_82"
            },
            {
                "name": "Getein Biotech, Inc. Novel Coronavirus (2019-nCoV) Real-time RT-PCR Kit (CE-IVD) ",
                "id": "getein_biotech_inc_novel_coronavirus_2019_ncov_real_time_rt_pcr_kit_ce_ivd_56"
            },
            {
                "name": "Getein Biotech, Inc. One Step Test for Novel Coronavirus (2019-nCoV) IgM/IgG Antibody (Colloidal Gold) (CE-IVD) ",
                "id": "getein_biotech_inc_one_step_test_for_novel_coronavirus_2019_ncov_igm_igg_antibody_colloidal_gold_ce_ivd_67"
            },
            {
                "name": "GNA Biosolutions GmbH SARS-CoV-2 Detection Kit on portable PCA Analyzer (In development) ",
                "id": "gna_biosolutions_gmbh_sars_cov_2_detection_kit_on_portable_pca_analyzer_in_development_82"
            },
            {
                "name": "Goldsite Diagnostics Inc. SARS-CoV-2 IgG/IgM Kit (manual) (CE-IVD) ",
                "id": "goldsite_diagnostics_inc_sars_cov_2_igg_igm_kit_manual_ce_ivd_8"
            },
            {
                "name": "Great Basin – Vela Operations SARS-CoV-2 Direct Test (in development) ",
                "id": "great_basin___vela_operations_sars_cov_2_direct_test_in_development_78"
            },
            {
                "name": "Guangdong Huayin Medicine Science Co,. Ltd Detection Kit for 2019-nCoV RNA (RT-PCR Fluorescence Probing) (Lyophilised) (in development) ",
                "id": "guangdong_huayin_medicine_science_co_ltd_detection_kit_for_2019_ncov_rna_rt_pcr_fluorescence_probing_lyophilised_in_development_27"
            },
            {
                "name": "Guangzhou Darui Biotechnology Co.,Ltd 2019 Novel Coronavirus (2019-nCoV) IgG Antibody Detection Kit (ELISA Method) (RUO) ",
                "id": "guangzhou_darui_biotechnology_co_ltd_2019_novel_coronavirus_2019_ncov_igg_antibody_detection_kit_elisa_method_ruo_49"
            },
            {
                "name": "Guangzhou Darui Biotechnology Co.,Ltd 2019 Novel Coronavirus (2019-nCoV) IgM Antibody Detection Kit (ELISA Method) (RUO) ",
                "id": "guangzhou_darui_biotechnology_co_ltd_2019_novel_coronavirus_2019_ncov_igm_antibody_detection_kit_elisa_method_ruo_2"
            },
            {
                "name": "Guangzhou Darui Biotechnology Co.,Ltd Novel Coronavirus 2019-nCoV IgG Antibody Detection Kit (Colloidal Gold Method) (RUO) ",
                "id": "guangzhou_darui_biotechnology_co_ltd_novel_coronavirus_2019_ncov_igg_antibody_detection_kit_colloidal_gold_method_ruo_79"
            },
            {
                "name": "Guangzhou Darui Biotechnology Co.,Ltd Novel Coronavirus 2019-nCoV IgM Antibody Detection Kit (Colloidal Gold Method) (RUO) ",
                "id": "guangzhou_darui_biotechnology_co_ltd_novel_coronavirus_2019_ncov_igm_antibody_detection_kit_colloidal_gold_method_ruo_83"
            },
            {
                "name": "Guangzhou Fenghua Bioengineering , Co. LTD Combined Detection Kit for Novel Coronavirus (2019-nCoV) IgM/IgG Antibody (RUO) ",
                "id": "guangzhou_fenghua_bioengineering__co_ltd_combined_detection_kit_for_novel_coronavirus_2019_ncov_igm_igg_antibody_ruo_52"
            },
            {
                "name": "Guangzhou FulenGen Co., Ltd RT-qPCR based SARS-CoV-2 detection kit with SPRS (Spike-in Reference Standard) (In development) ",
                "id": "guangzhou_fulengen_co_ltd_rt_qpcr_based_sars_cov_2_detection_kit_with_sprs_spike_in_reference_standard_in_development_10"
            },
            {
                "name": "Guangzhou HEAS BioTech Co., Ltd 2019 Novel Coronavirus (2019-nCoV) RNA ASSAY (PCR Fluorescent Probe Method) (RUO) ",
                "id": "guangzhou_heas_biotech_co_ltd_2019_novel_coronavirus_2019_ncov_rna_assay_pcr_fluorescent_probe_method_ruo_26"
            },
            {
                "name": "Guangzhou Hybribio Medicine Technology Ltd Respiratory Virus (IFVa/b + COVID-19) Real-Time PCR Kit (in development) ",
                "id": "guangzhou_hybribio_medicine_technology_ltd_respiratory_virus_ifva_b___covid_19_real_time_pcr_kit_in_development_18"
            },
            {
                "name": "Guangzhou Supbio Biotechnologies, Inc Supbio SARS-CoV-2 (ORF1ab/N) (Nucleic Acid Detection Kit / PCR-Fluorescent) (RUO) ",
                "id": "guangzhou_supbio_biotechnologies_inc_supbio_sars_cov_2_orf1ab_n_nucleic_acid_detection_kit___pcr_fluorescent_ruo_35"
            },
            {
                "name": "Guangzhou Tebsun Bio-Tech Development Co., Ltd SARS-CoV-2 Nucleic Acid Test (LAMP) (RUO) ",
                "id": "guangzhou_tebsun_bio_tech_development_co_ltd_sars_cov_2_nucleic_acid_test_lamp_ruo_24"
            },
            {
                "name": "Guangzhou Wondfo Biotech Co., Ltd Finecare SARS-CoV-2 Antibody Test (manual) (RUO) ",
                "id": "guangzhou_wondfo_biotech_co_ltd_finecare_sars_cov_2_antibody_test_manual_ruo_78"
            },
            {
                "name": "Guangzhou Wondfo Biotech Co., Ltd Wondfo SARS-CoV-2 Nucleic Acid Detection Kit (RUO) ",
                "id": "guangzhou_wondfo_biotech_co_ltd_wondfo_sars_cov_2_nucleic_acid_detection_kit_ruo_54"
            },
            {
                "name": "Hanghzhou AllTest Biotech Co., Ltd 2019-nCoV IgG/IgM Rapid Test Cassette (CE-IVD) ",
                "id": "hanghzhou_alltest_biotech_co_ltd_2019_ncov_igg_igm_rapid_test_cassette_ce_ivd_34"
            },
            {
                "name": "Hangzhou Bigfish Bio-tech Co., Ltd LAMP kit for qualitative detection of SARS-CoV-2 (in development) ",
                "id": "hangzhou_bigfish_bio_tech_co_ltd_lamp_kit_for_qualitative_detection_of_sars_cov_2_in_development_81"
            },
            {
                "name": "Hangzhou Bigfish Bio-tech Co., Ltd The golden standard of SARS-CoV-2 viral nucleic acid detection (in development) ",
                "id": "hangzhou_bigfish_bio_tech_co_ltd_the_golden_standard_of_sars_cov_2_viral_nucleic_acid_detection_in_development_83"
            },
            {
                "name": "Hangzhou Biotest Biotech Co., Ltd COVID-19 IgG/IgM Rapid Test Cassette (Whole Blood/Serum/Plasma) (CE-IVD) ",
                "id": "hangzhou_biotest_biotech_co_ltd_covid_19_igg_igm_rapid_test_cassette_whole_blood_serum_plasma_ce_ivd_70"
            },
            {
                "name": "Hangzhou Clongene Biotech Co., Ltd 2019-nCoV IgG/IgM Rapid Test (CE-IVD) ",
                "id": "hangzhou_clongene_biotech_co_ltd_2019_ncov_igg_igm_rapid_test_ce_ivd_41"
            },
            {
                "name": "Hangzhou Dan Wei Biotechnology Co.Ltd 2019-nCoV Direct RT-qPCR Kit (in development) ",
                "id": "hangzhou_dan_wei_biotechnology_coltd_2019_ncov_direct_rt_qpcr_kit_in_development_12"
            },
            {
                "name": "Hangzhou Laihe Biotech Co., Ltd LYHER Novel Coronavirus(2019-nCoV) IgM/IgG Antibody Combo Test Kit (Colloidal Gold) (Australia TGA - CE-IVD) ",
                "id": "hangzhou_laihe_biotech_co_ltd_lyher_novel_coronavirus2019_ncov_igm_igg_antibody_combo_test_kit_colloidal_gold_australia_tga___ce_ivd_91"
            },
            {
                "name": "Hangzhou Matridx Biotechnology Co., Ltd 2019-nCov Rapid Test Kit (RUO) ",
                "id": "hangzhou_matridx_biotechnology_co_ltd_2019_ncov_rapid_test_kit_ruo_56"
            },
            {
                "name": "Hangzhou Matridx Biotechnology Co., Ltd 2019-nCov Rapid Test Kit (RUO) ",
                "id": "hangzhou_matridx_biotechnology_co_ltd_2019_ncov_rapid_test_kit_ruo_65"
            },
            {
                "name": "Hangzhou Really Tech Co., Ltd 2019-nCOV LgG/LgM Rapid Test Device (CE-IVD) ",
                "id": "hangzhou_really_tech_co_ltd_2019_ncov_lgg_lgm_rapid_test_device_ce_ivd_2"
            },
            {
                "name": "Hangzhou Testsea Biotechnology Co., Ltd New Coronavirus COVID-19 Nucleic Acid Detection Kit (Fluorescent PCR Method) (RUO) ",
                "id": "hangzhou_testsea_biotechnology_co_ltd_new_coronavirus_covid_19_nucleic_acid_detection_kit_fluorescent_pcr_method_ruo_60"
            },
            {
                "name": "Hecin Scientific, Inc. COVID-19 IgM Antibody Rapid Test Kit (China FDA - CE-IVD) ",
                "id": "hecin_scientific_inc_covid_19_igm_antibody_rapid_test_kit_china_fda___ce_ivd_43"
            },
            {
                "name": "Hibergene Hibergene (lab-based or near-POC) (In development)",
                "id": "hibergene_hibergene_lab_based_or_near_poc_in_development55"
            },
            {
                "name": "Hologic Panther Fusion SARS-CoV-2 assay (US FDA-EUA)",
                "id": "hologic_panther_fusion_sars_cov_2_assay_us_fda_eua63"
            },
            {
                "name": "Humasis Humasis COVID-19 IgG/IgM Test (Korea MFDS - CE-IVD) ",
                "id": "humasis_humasis_covid_19_igg_igm_test_korea_mfds___ce_ivd_46"
            },
            {
                "name": "Hunan Lituo Biotechnology Co., Ltd COVID-19 IgG/IgM Detection Kit (Colloidal Gold) (CE-IVD) ",
                "id": "hunan_lituo_biotechnology_co_ltd_covid_19_igg_igm_detection_kit_colloidal_gold_ce_ivd_48"
            },
            {
                "name": "Hunan Yonghe-Sun Biotechnology Co., Ltd SARS-COV-2 specific antibody test kit (Immunochromatography) (RUO) ",
                "id": "hunan_yonghe_sun_biotechnology_co_ltd_sars_cov_2_specific_antibody_test_kit_immunochromatography_ruo_74"
            },
            {
                "name": "Huwel Lifesciences Pvt. Ltd. Quantiplus CORONA Virus (2019nCoV) detection kit (in development) ",
                "id": "huwel_lifesciences_pvt_ltd_quantiplus_corona_virus_2019ncov_detection_kit_in_development_67"
            },
            {
                "name": "ICBFM LAMP kit for qualitative detection of SARS-CoV-2 (RUO) ",
                "id": "icbfm_lamp_kit_for_qualitative_detection_of_sars_cov_2_ruo_88"
            },
            {
                "name": "InBios International, Inc. InBios International Smart Detect SARS-CoV-2 rRT-PCR Kit (RUO) ",
                "id": "inbios_international_inc_inbios_international_smart_detect_sars_cov_2_rrt_pcr_kit_ruo_66"
            },
            {
                "name": "InDevR Inc. COVID Serology Kit: Multiplexed Immunoassay (in development) ",
                "id": "indevr_inc_covid_serology_kit__multiplexed_immunoassay_in_development_63"
            },
            {
                "name": "Innovita (Tangshan) Biological Technology Co., Ltd Novel Coronavirus (2019-nCoV) Nucleic Acid Test Kit (Multiple Fluorescence PCR) (RUO) ",
                "id": "innovita_tangshan_biological_technology_co_ltd_novel_coronavirus_2019_ncov_nucleic_acid_test_kit_multiple_fluorescence_pcr_ruo_56"
            },
            {
                "name": "Innovita Biological Technology Co. Ltd 2019-nCoV Ab Test (Colloidal Gold) (IgM/IgG Whole Blood/Serum/Plasma Combo) (CE-IVD) ",
                "id": "innovita_biological_technology_co_ltd_2019_ncov_ab_test_colloidal_gold_igm_igg_whole_blood_serum_plasma_combo_ce_ivd_40"
            },
            {
                "name": "Intavis Peptide Services GmbH & Co. KG Covid19-hullB CelluSpot™ Array (RUO) ",
                "id": "intavis_peptide_services_gmbh___co_kg_covid19_hullb_celluspot_array_ruo_14"
            },
            {
                "name": "Intavis Peptide Services GmbH & Co. KG Covid19-hullS CelluSpot™ Array (RUO) ",
                "id": "intavis_peptide_services_gmbh___co_kg_covid19_hulls_celluspot_array_ruo_28"
            },
            {
                "name": "InTec Products, Inc. Rapid SARS-CoV-2 Antibody (IgM/IgG) (CE-IVD) ",
                "id": "intec_products_inc_rapid_sars_cov_2_antibody_igm_igg_ce_ivd_24"
            },
            {
                "name": "InTec Products, Inc. Rapid SARS-CoV-2 Antibody Test (CE-IVD) ",
                "id": "intec_products_inc_rapid_sars_cov_2_antibody_test_ce_ivd_80"
            },
            {
                "name": "Intrasense SA Myrian Covid-19 (China FDA-EUA - US FDA-EUA - CE-IVD) ",
                "id": "intrasense_sa_myrian_covid_19_china_fda_eua___us_fda_eua___ce_ivd_94"
            },
            {
                "name": "IVDbio Inc. Machine-Free, Fast and Accurate Nucleic Acid Diagnoses System for COVID-19 (in development) ",
                "id": "ivdbio_inc_machine_free_fast_and_accurate_nucleic_acid_diagnoses_system_for_covid_19_in_development_58"
            },
            {
                "name": "Jiangsu Bioperfectus Technologies Co. Ltd PerfectLyo SARS-COV-2 Real Time PCR kit (RUO) ",
                "id": "jiangsu_bioperfectus_technologies_co_ltd_perfectlyo_sars_cov_2_real_time_pcr_kit_ruo_36"
            },
            {
                "name": "Jiangsu Bioperfectus Technologies Co. Ltd PerfectPOC Novel Corona Virus (SARS-CoV-2) Ag Rapid Test Kit (CE-IVD) ",
                "id": "jiangsu_bioperfectus_technologies_co_ltd_perfectpoc_novel_corona_virus_sars_cov_2_ag_rapid_test_kit_ce_ivd_85"
            },
            {
                "name": "Jiangsu Bioperfectus Technologies Co. Ltd PerfectPOC Novel Corona Virus (SARS-CoV-2) IgM/IgG Rapid Test Kit (CE-IVD) ",
                "id": "jiangsu_bioperfectus_technologies_co_ltd_perfectpoc_novel_corona_virus_sars_cov_2_igm_igg_rapid_test_kit_ce_ivd_8"
            },
            {
                "name": "Jiangsu Bioperfectus Technologies Co. Ltd PerfectQ COVID-19 Coronavirus Real Time PCR Kit (RUO) ",
                "id": "jiangsu_bioperfectus_technologies_co_ltd_perfectq_covid_19_coronavirus_real_time_pcr_kit_ruo_14"
            },
            {
                "name": "Jiangsu Microdiag Biomedicine Technology Co., Ltd Detection of 2019 novel coronavirus (2019-nCoV) by LFD RT-RAA (RUO) ",
                "id": "jiangsu_microdiag_biomedicine_technology_co_ltd_detection_of_2019_novel_coronavirus_2019_ncov_by_lfd_rt_raa_ruo_45"
            },
            {
                "name": "Jiangsu Microdiag Biomedicine Technology Co., Ltd Novel coronavirus 2019-nCoV nucleic acid detection kit (rRT- PCR method) (RUO) ",
                "id": "jiangsu_microdiag_biomedicine_technology_co_ltd_novel_coronavirus_2019_ncov_nucleic_acid_detection_kit_rrt__pcr_method_ruo_82"
            },
            {
                "name": "Jiangsu Qitian Gene Biotechnology Co., Ltd Fluorescent RAA Detection for 2019-nCoV (RUO) ",
                "id": "jiangsu_qitian_gene_biotechnology_co_ltd_fluorescent_raa_detection_for_2019_ncov_ruo_22"
            },
            {
                "name": "Jiangsu Superbio Biomedical Technology (Nanjing) Co., Ltd Fast SARS-CoV-2 lgM/lgG Antibody Detection Kit (Colloidal Gold) (RUO) ",
                "id": "jiangsu_superbio_biomedical_technology_nanjing_co_ltd_fast_sars_cov_2_lgm_lgg_antibody_detection_kit_colloidal_gold_ruo_82"
            },
            {
                "name": "JinHuan Medical Instrument Co., Ltd (COVID-19) IgM/IgG Antibody Fast Detection Kit (Colloidal Gold) (CE-IVD) ",
                "id": "jinhuan_medical_instrument_co_ltd_covid_19_igm_igg_antibody_fast_detection_kit_colloidal_gold_ce_ivd_29"
            },
            {
                "name": "JN Medsys ProTect Covid-19 RT-qPCR kit (RUO) ",
                "id": "jn_medsys_protect_covid_19_rt_qpcr_kit_ruo_69"
            },
            {
                "name": "Kephera Diagnostics KDx COVID-19 Antigen Detection Rapid Test (in development) ",
                "id": "kephera_diagnostics_kdx_covid_19_antigen_detection_rapid_test_in_development_65"
            },
            {
                "name": "Kephera Diagnostics KDx COVID-19 IgG and IgM ELISA (manual) (in development) ",
                "id": "kephera_diagnostics_kdx_covid_19_igg_and_igm_elisa_manual_in_development_80"
            },
            {
                "name": "Kephera Diagnostics KDx COVID-19 IgG/IgM Rapid Detection Test Kit (in development) ",
                "id": "kephera_diagnostics_kdx_covid_19_igg_igm_rapid_detection_test_kit_in_development_85"
            },
            {
                "name": "Kephera Diagnostics KDx COVID-19 IgG/IgM Rapid Detection Test Kit (in development) ",
                "id": "kephera_diagnostics_kdx_covid_19_igg_igm_rapid_detection_test_kit_in_development_10"
            },
            {
                "name": "KH Medical Co. Ltd RADI COVID-19 Detection Kit and RADI COVID-19 Triple Detection Kit (CE-IVD) ",
                "id": "kh_medical_co_ltd_radi_covid_19_detection_kit_and_radi_covid_19_triple_detection_kit_ce_ivd_31"
            },
            {
                "name": "KogeneBiotech Co. Ltd PowerChekTM 2019-nCoV Real-time PCR Kit (Korea MFDS–EUA - CE-IVD) ",
                "id": "kogenebiotech_co_ltd_powerchektm_2019_ncov_real_time_pcr_kit_korea_mfds_eua___ce_ivd_43"
            },
            {
                "name": "KRISHGEN BioSystems Human Anti-SARS-CoV-2 (Covid-19) IgG/IgM Rapid Test (CE-IVD) ",
                "id": "krishgen_biosystems_human_anti_sars_cov_2_covid_19_igg_igm_rapid_test_ce_ivd_53"
            },
            {
                "name": "KRISHGEN BioSystems Human Anti-SARS-CoV-2 (Covid-19) IgM Rapid Test (RUO) ",
                "id": "krishgen_biosystems_human_anti_sars_cov_2_covid_19_igm_rapid_test_ruo_37"
            },
            {
                "name": "KRISHGEN BioSystems Human Anti-SARS-CoV-2 (Covid-19) Nucleocapsid Protein IgG ELISA (manual) (RUO) ",
                "id": "krishgen_biosystems_human_anti_sars_cov_2_covid_19_nucleocapsid_protein_igg_elisa_manual_ruo_31"
            },
            {
                "name": "KRISHGEN BioSystems Human Anti-SARS-CoV-2 (Covid-19) Spike Protein IgG ELISA (manual) (RUO) ",
                "id": "krishgen_biosystems_human_anti_sars_cov_2_covid_19_spike_protein_igg_elisa_manual_ruo_71"
            },
            {
                "name": "KRISHGEN BioSystems Human SARS-CoV-2 (Covid-19) ELISA (manual) (RUO) ",
                "id": "krishgen_biosystems_human_sars_cov_2_covid_19_elisa_manual_ruo_66"
            },
            {
                "name": "KRISHGEN BioSystems SARS-CoV-2 (Covid-19) Real-Time PCR Kit (as per CDC Atlanta guidelines) (CE-IVD) ",
                "id": "krishgen_biosystems_sars_cov_2_covid_19_real_time_pcr_kit_as_per_cdc_atlanta_guidelines_ce_ivd_42"
            },
            {
                "name": "KRISHGEN BioSytems Human SARS-CoV-2 (Covid-19) Qualitative ELISA (manual) (RUO) ",
                "id": "krishgen_biosytems_human_sars_cov_2_covid_19_qualitative_elisa_manual_ruo_1"
            },
            {
                "name": "Krosgen Biotech KrosQuanT SARS-COV- 2 (2019 nCOV) Realtime PCR Kit (CE-IVD) ",
                "id": "krosgen_biotech_krosquant_sars_cov__2_2019_ncov_realtime_pcr_kit_ce_ivd_99"
            },
            {
                "name": "Landcent Europe B.V. Real time RT-PCR Kit for the detection of SARS-CoV-2 (in development) ",
                "id": "landcent_europe_bv_real_time_rt_pcr_kit_for_the_detection_of_sars_cov_2_in_development_65"
            },
            {
                "name": "Leadgene Biomedical, Inc. Leadgene® SARS/SARS-CoV-2 Antigen Rapid Test Kit (in development) ",
                "id": "leadgene_biomedical_inc_leadgene_sars_sars_cov_2_antigen_rapid_test_kit_in_development_100"
            },
            {
                "name": "Leadgene Biomedical, Inc. Leadgene® SARS/SARS-CoV-2 IgG/IgM Rapid Test Kit (in development) ",
                "id": "leadgene_biomedical_inc_leadgene_sars_sars_cov_2_igg_igm_rapid_test_kit_in_development_76"
            },
            {
                "name": "Lifeassay Diagnostics Pty Ltd Test-it COVID-19 IgM/IgG Lateral Flow Assay (in development) ",
                "id": "lifeassay_diagnostics_pty_ltd_test_it_covid_19_igm_igg_lateral_flow_assay_in_development_20"
            },
            {
                "name": "Liming Bio-Products Co., Ltd COVID-19 Antigen Rapid Test Device (CE-IVD) ",
                "id": "liming_bio_products_co_ltd_covid_19_antigen_rapid_test_device_ce_ivd_51"
            },
            {
                "name": "Liming Bio-Products Co., Ltd COVID-19 IgG/IgM Combo Rapid Test Device (CE-IVD)",
                "id": "liming_bio_products_co_ltd_covid_19_igg_igm_combo_rapid_test_device_ce_ivd62"
            },
            {
                "name": "Liming Bio-Products Co., Ltd COVID-19 IgG/IgM Combo Rapid Test Device (CE-IVD) ",
                "id": "liming_bio_products_co_ltd_covid_19_igg_igm_combo_rapid_test_device_ce_ivd_48"
            },
            {
                "name": "Liming Bio-Products Co., Ltd SrongStep®Novel Coronavirus (SARS-CoV-2) Multiplex Real-Time PCR Kit (CE-IVD) ",
                "id": "liming_bio_products_co_ltd_srongstepnovel_coronavirus_sars_cov_2_multiplex_real_time_pcr_kit_ce_ivd_53"
            },
            {
                "name": "LOMINA AG SARS-CoV-2(COVID19)IgM/IgG Antibody Fast Detection Kit (CE-IVD) ",
                "id": "lomina_ag_sars_cov_2covid19igm_igg_antibody_fast_detection_kit_ce_ivd_45"
            },
            {
                "name": "Lumex Instruments Microchip RT-PCR COVID-19 detection system (RUO) ",
                "id": "lumex_instruments_microchip_rt_pcr_covid_19_detection_system_ruo_28"
            },
            {
                "name": "Luminex Corp. ARIES SARS-CoV-2 Assay (US FDA) ",
                "id": "luminex_corp_aries_sars_cov_2_assay_us_fda_90"
            },
            {
                "name": "Luminex Corp. NxTAG CoV Extended Panel (RUO) ",
                "id": "luminex_corp_nxtag_cov_extended_panel_ruo_98"
            },
            {
                "name": "Luminostics, Inc. CLIP-COVID19 (smartphone-read out high sensivity antigen detection test) (in development) ",
                "id": "luminostics_inc_clip_covid19_smartphone_read_out_high_sensivity_antigen_detection_test_in_development_70"
            },
            {
                "name": "LumiQuick Diagnostics Inc. QuickProfile™ 2019-nCoV IgG/IgM Combo Test Card (CE-IVD) ",
                "id": "lumiquick_diagnostics_inc_quickprofile_2019_ncov_igg_igm_combo_test_card_ce_ivd_58"
            },
            {
                "name": "Mabsky Bio-Tech Co., Ltd COVID-19 virus (2019-nCoV) Dual-Detection Kit (CE-IVD) ",
                "id": "mabsky_bio_tech_co_ltd_covid_19_virus_2019_ncov_dual_detection_kit_ce_ivd_36"
            },
            {
                "name": "Mabsky Bio-Tech Co., Ltd COVID-19 virus (2019-nCOV) Triple-Detection Kit (Real-Time PCR Method) (CE-IVD) ",
                "id": "mabsky_bio_tech_co_ltd_covid_19_virus_2019_ncov_triple_detection_kit_real_time_pcr_method_ce_ivd_76"
            },
            {
                "name": "Mabsky Bio-Tech Co., Ltd Influenza A virus, Influenza B virus & COVID-19 virus (2019-nCoV) Triple-Detection Kit (CE-IVD) ",
                "id": "mabsky_bio_tech_co_ltd_influenza_a_virus_influenza_b_virus___covid_19_virus_2019_ncov_triple_detection_kit_ce_ivd_60"
            },
            {
                "name": "Maccura Biotechnology Co., Ltd SARS-CoV-2 Fluorescent PCR (China FDA-EUA - CE-IVD) ",
                "id": "maccura_biotechnology_co_ltd_sars_cov_2_fluorescent_pcr_china_fda_eua___ce_ivd_15"
            },
            {
                "name": "Mammoth Biosciences SARS-CoV-2 DETECTR (in development) ",
                "id": "mammoth_biosciences_sars_cov_2_detectr_in_development_12"
            },
            {
                "name": "Medical & Biological Laboratories Co., Ltd FLUOROSEARCH Novel Coronavirus (SARS-CoV-2) Detection Kit (RUO) ",
                "id": "medical___biological_laboratories_co_ltd_fluorosearch_novel_coronavirus_sars_cov_2_detection_kit_ruo_82"
            },
            {
                "name": "Medical Innovation Ventures Sdn Bhd. GenoAmp® Real-Time RT-PCR SARS-CoV-2 (CE-IVD) ",
                "id": "medical_innovation_ventures_sdn_bhd_genoamp_real_time_rt_pcr_sars_cov_2_ce_ivd_56"
            },
            {
                "name": "Medical System Coronavirus PCR test (China FDA - CE-IVD) ",
                "id": "medical_system_coronavirus_pcr_test_china_fda___ce_ivd_7"
            },
            {
                "name": "MedicalSystem Biotechnology Co., Ltd COVID-19 IgM/IgG Rapid Test Cassette (CE-IVD) ",
                "id": "medicalsystem_biotechnology_co_ltd_covid_19_igm_igg_rapid_test_cassette_ce_ivd_81"
            },
            {
                "name": "Mediclone Biotech Pvt Ltd @sight COVID-19 IgG/IgM Rapid Test Kit (in development) ",
                "id": "mediclone_biotech_pvt_ltd__sight_covid_19_igg_igm_rapid_test_kit_in_development_61"
            },
            {
                "name": "Medigen Vaccine Biologics Corp. MVC SARS-CoV-2 Convective PCR Diagnostic Device/Kit (RUO) ",
                "id": "medigen_vaccine_biologics_corp_mvc_sars_cov_2_convective_pcr_diagnostic_device_kit_ruo_87"
            },
            {
                "name": "Medigen Vaccine Biologics Corp. MVC SARS-CoV-2 Real-Time PCR Diagnostic Kit (RUO) ",
                "id": "medigen_vaccine_biologics_corp_mvc_sars_cov_2_real_time_pcr_diagnostic_kit_ruo_26"
            },
            {
                "name": "MedStar Medical Co., Ltd One-step Direct Realtime PCR Test Kit of 2019-nCoV Coronavirus (in development) ",
                "id": "medstar_medical_co_ltd_one_step_direct_realtime_pcr_test_kit_of_2019_ncov_coronavirus_in_development_87"
            },
            {
                "name": "Mei Ning Kang Cheng China Biotechnology R&D Center, Inc. Corona Virus Disease 2019 (COVID-19) IgM/IgG Detection Kit (RUO) ",
                "id": "mei_ning_kang_cheng_china_biotechnology_r_d_center_inc_corona_virus_disease_2019_covid_19_igm_igg_detection_kit_ruo_59"
            },
            {
                "name": "MiCo Biomed Co. Ltd VERI-QTM PCR 316 COVID-19 detection system (CE-IVD) ",
                "id": "mico_biomed_co_ltd_veri_qtm_pcr_316_covid_19_detection_system_ce_ivd_67"
            },
            {
                "name": "Mikrogen GmbH ampliCube Coronavirus Panel (CE-IVD) ",
                "id": "mikrogen_gmbh_amplicube_coronavirus_panel_ce_ivd_36"
            },
            {
                "name": "Mikrogen GmbH ampliCube Coronavirus SARS-CoV-2 (CE-IVD) ",
                "id": "mikrogen_gmbh_amplicube_coronavirus_sars_cov_2_ce_ivd_69"
            },
            {
                "name": "Mobidiag Novadiag® COVID-19 + InfA/B (lab-based & near-POC) (in development) ",
                "id": "mobidiag_novadiag_covid_19___infa_b_lab_based___near_poc_in_development_68"
            },
            {
                "name": "Module Innovations Private Ltd nCoVSENSe: IgM/ IgG test for spike and N-protein of SARS-CoV 2 (manual) (in development) ",
                "id": "module_innovations_private_ltd_ncovsense__igm__igg_test_for_spike_and_n_protein_of_sars_cov_2_manual_in_development_10"
            },
            {
                "name": "Mokobio Biotechnology R&D Center SARS-CoV-2 IgM & IgG Quantum Dot Immunoassay (CE-IVD) ",
                "id": "mokobio_biotechnology_r_d_center_sars_cov_2_igm___igg_quantum_dot_immunoassay_ce_ivd_43"
            },
            {
                "name": "Molbio Diagnostics Pvt Ltd Truenat SARS CoV-2 (lab-based or near-POC) (India DCGI) ",
                "id": "molbio_diagnostics_pvt_ltd_truenat_sars_cov_2_lab_based_or_near_poc_india_dcgi_50"
            },
            {
                "name": "Mologic Ltd Mologic COVID-19 Rapid Test (in development) ",
                "id": "mologic_ltd_mologic_covid_19_rapid_test_in_development_42"
            },
            {
                "name": "MP Biomedicals MP Rapid 2019-nCoV IgG/IgM (CE-IVD) ",
                "id": "mp_biomedicals_mp_rapid_2019_ncov_igg_igm_ce_ivd_18"
            },
            {
                "name": "Mylab Discovery Solutions Pvt Ltd PathoDetect CoVID-19 Detection Kit (RUO) ",
                "id": "mylab_discovery_solutions_pvt_ltd_pathodetect_covid_19_detection_kit_ruo_91"
            },
            {
                "name": "nal von minden GmbH NADAL® COVID-19 IgG/IgM Test (243003N-25, 243002N-20, 243001N-10) (CE-IVD) ",
                "id": "nal_von_minden_gmbh_nadal_covid_19_igg_igm_test_243003n_25_243002n_20_243001n_10_ce_ivd_61"
            },
            {
                "name": "Nanjing BioPoint Diagnostics BioPoint SARS-CoV-2 dIgA/total antibody rapid test (in development) ",
                "id": "nanjing_biopoint_diagnostics_biopoint_sars_cov_2_diga_total_antibody_rapid_test_in_development_37"
            },
            {
                "name": "Nanjing Vazyme Medical Technology Co., Ltd 2019-Novel Coronavirus (2019-nCoV) Triplex RT-qPCR Detection Kit (CE-IVD) ",
                "id": "nanjing_vazyme_medical_technology_co_ltd_2019_novel_coronavirus_2019_ncov_triplex_rt_qpcr_detection_kit_ce_ivd_52"
            },
            {
                "name": "NanoBio Lab, A*STAR Research Entities Isothermal Exponential Amplification for COVID-19 Detection (RUO) ",
                "id": "nanobio_lab_a_star_research_entities_isothermal_exponential_amplification_for_covid_19_detection_ruo_84"
            },
            {
                "name": "NanoEnTek COVID-19 IgG/IgM Duo (automated) (CE-IVD) ",
                "id": "nanoentek_covid_19_igg_igm_duo_automated_ce_ivd_52"
            },
            {
                "name": "Nantong Egens Biotechnology Co., Ltd COVID-19 IgG/IgM Rapid Test Kit (Colloidal Gold) (CE-IVD) ",
                "id": "nantong_egens_biotechnology_co_ltd_covid_19_igg_igm_rapid_test_kit_colloidal_gold_ce_ivd_65"
            },
            {
                "name": "National Institute for Control of Vaccines and Biologicals Accupid nCoV 2019 Detection Kit (RUO) ",
                "id": "national_institute_for_control_of_vaccines_and_biologicals_accupid_ncov_2019_detection_kit_ruo_38"
            },
            {
                "name": "Naturitious LLC Viralert COVID-19 IgG/IgM Antibody Rapid Test Kit (RUO) ",
                "id": "naturitious_llc_viralert_covid_19_igg_igm_antibody_rapid_test_kit_ruo_45"
            },
            {
                "name": "Next Pharma Inc. DiaCarta's QuantiVirusTMSARS-CoV-2 Test (US FDA-EUA - CE-IVD) ",
                "id": "next_pharma_inc_diacarta_s_quantivirustmsars_cov_2_test_us_fda_eua___ce_ivd_7"
            },
            {
                "name": "Ningbo Health Gene Technologies Co. Ltd. SARS-CoV-2 Virus Detection Diagnostic Kit (RT- qPCR Method) (RUO) ",
                "id": "ningbo_health_gene_technologies_co_ltd_sars_cov_2_virus_detection_diagnostic_kit_rt__qpcr_method_ruo_47"
            },
            {
                "name": "Nirmidas Biotech, Inc. pGOLD COVID-19 IgG/IgM/IgA Microarray Test (RUO) ",
                "id": "nirmidas_biotech_inc_pgold_covid_19_igg_igm_iga_microarray_test_ruo_74"
            },
            {
                "name": "Nirmidas Biotech, Inc. Rapid COVID-19 (SARS-CoV-2) IgM/IgG Antibody Detection Kit ",
                "id": "nirmidas_biotech_inc_rapid_covid_19_sars_cov_2_igm_igg_antibody_detection_kit_83"
            },
            {
                "name": "Norgen Biotek Corp 2019-nCoV TaqMan RT-PCR Kit (Catalog# TM67100) (RUO) ",
                "id": "norgen_biotek_corp_2019_ncov_taqman_rt_pcr_kit_catalog#_tm67100_ruo_28"
            },
            {
                "name": "Novacyt/primerdesign genesig Real-Time PCR COVID-19 (USA FDA-EUA - WHO-EUL - CE-IVD)",
                "id": "novacyt_primerdesign_genesig_real_time_pcr_covid_19_usa_fda_eua___who_eul___ce_ivd54"
            },
            {
                "name": "NovaTec Immundiagnostica GmbH NovaLisa® COVID-19 (SARS-CoV-2) IgA (RUO) ",
                "id": "novatec_immundiagnostica_gmbh_novalisa_covid_19_sars_cov_2_iga_ruo_2"
            },
            {
                "name": "NovaTec Immundiagnostica GmbH NovaLisa® COVID-19 (SARS-CoV-2) IgG (RUO) ",
                "id": "novatec_immundiagnostica_gmbh_novalisa_covid_19_sars_cov_2_igg_ruo_66"
            },
            {
                "name": "NovaTec Immundiagnostica GmbH NovaLisa® COVID-19 (SARS-CoV-2) IgM (RUO) ",
                "id": "novatec_immundiagnostica_gmbh_novalisa_covid_19_sars_cov_2_igm_ruo_42"
            },
            {
                "name": "OPTOLANE Technologies Inc. Dr. PCR COVID-19 Viral Load 20K (lab-based) (RUO) ",
                "id": "optolane_technologies_inc_dr_pcr_covid_19_viral_load_20k_lab_based_ruo_100"
            },
            {
                "name": "OsangHealthcare GeneFinder COVID-19 Plus RealAmp Kit (CE-IVD)",
                "id": "osanghealthcare_genefinder_covid_19_plus_realamp_kit_ce_ivd4"
            },
            {
                "name": "Paragon Genomics Inc. CleanPlex SARS-CoV-2 Research and Surveillance NGS Panel (RUO) ",
                "id": "paragon_genomics_inc_cleanplex_sars_cov_2_research_and_surveillance_ngs_panel_ruo_42"
            },
            {
                "name": "PaxGen Bio Co. Ltd PaxView COVID-19 real time RT-PCR (RUO) ",
                "id": "paxgen_bio_co_ltd_paxview_covid_19_real_time_rt_pcr_ruo_13"
            },
            {
                "name": "PCL Inc. PCL COVID19 Ag Rapid FIA (CE-IVD) ",
                "id": "pcl_inc_pcl_covid19_ag_rapid_fia_ce_ivd_95"
            },
            {
                "name": "PCL Inc. PCL COVID19 IgG/IgM Rapid Gold (Korea MFDS - CE-IVD) ",
                "id": "pcl_inc_pcl_covid19_igg_igm_rapid_gold_korea_mfds___ce_ivd_17"
            },
            {
                "name": "PCL Inc. PCLMD™ nCoV one step RT-PCR Kit (Korea MFDS - CE-IVD) ",
                "id": "pcl_inc_pclmd_ncov_one_step_rt_pcr_kit_korea_mfds___ce_ivd_36"
            },
            {
                "name": "PDF 2pg flyer",
                "id": "pdf_2pg_flyer48"
            },
            {
                "name": "PEPperPRINT GmbH PEPperCHIP® SARS-CoV-2 Proteome Microarray (manual) (CE-IVD) ",
                "id": "pepperprint_gmbh_pepperchip_sars_cov_2_proteome_microarray_manual_ce_ivd_25"
            },
            {
                "name": "PerGrande BioTech Development Co., Ltd SARS-CoV-2 Antibody Detection Kit (Colloidal Gold Immunochromatographic assay) (CE-IVD) ",
                "id": "pergrande_biotech_development_co_ltd_sars_cov_2_antibody_detection_kit_colloidal_gold_immunochromatographic_assay_ce_ivd_84"
            },
            {
                "name": "PerkinElmer Inc. PerkinElmer® SARS-CoV-2 Realtime RT-PCR Assay (CE-IVD) ",
                "id": "perkinelmer_inc_perkinelmer_sars_cov_2_realtime_rt_pcr_assay_ce_ivd_45"
            },
            {
                "name": "PharmaAct AG COVID-19 rapid test (CE-IVD) ",
                "id": "pharmaact_ag_covid_19_rapid_test_ce_ivd_12"
            },
            {
                "name": "Pinpoint Science Inc. Pinpoint Covid-19 Screening Assay – Electrical detection of SARS-CoV-2 nucleocapsid protein using nanosensors and aptamer (in development) ",
                "id": "pinpoint_science_inc_pinpoint_covid_19_screening_assay___electrical_detection_of_sars_cov_2_nucleocapsid_protein_using_nanosensors_and_aptamer_in_development_68"
            },
            {
                "name": "Pinpoint Science Inc. Pinpoint Covid-19 Screening Assay (in development) ",
                "id": "pinpoint_science_inc_pinpoint_covid_19_screening_assay_in_development_63"
            },
            {
                "name": "Pishtaz Teb SARS-CoV-2 IgG ELISA Kit (CE-IVD) ",
                "id": "pishtaz_teb_sars_cov_2_igg_elisa_kit_ce_ivd_92"
            },
            {
                "name": "Pishtaz Teb SARS-CoV-2 IgM ELISA Kit (CE-IVD) ",
                "id": "pishtaz_teb_sars_cov_2_igm_elisa_kit_ce_ivd_93"
            },
            {
                "name": "PlexBio Co., Ltd PlexBio CoVid19/SARS/Influenza A, B Detection kit (in development) ",
                "id": "plexbio_co_ltd_plexbio_covid19_sars_influenza_a_b_detection_kit_in_development_43"
            },
            {
                "name": "Prantae Solutions Pte Ltd EyeRa-Covid (in development) ",
                "id": "prantae_solutions_pte_ltd_eyera_covid_in_development_5"
            },
            {
                "name": "Predigen Inc. HR-PreV (in development) ",
                "id": "predigen_inc_hr_prev_in_development_27"
            },
            {
                "name": "Premier Medical Corporation Pvt. Ltd SureStatus COVID-19 (SARS-CoV-2) Card Test (in development) ",
                "id": "premier_medical_corporation_pvt_ltd_surestatus_covid_19_sars_cov_2_card_test_in_development_41"
            },
            {
                "name": "Premier Medical Corporation Pvt. Ltd SureStatus COVID-19 (SARS-CoV-2) EIA Test (in development) ",
                "id": "premier_medical_corporation_pvt_ltd_surestatus_covid_19_sars_cov_2_eia_test_in_development_79"
            },
            {
                "name": "PRIMA Lab S.A. PRIMA COVID-19 IgG/IgM Rapid Test (For Professional Use) (CE-IVD) ",
                "id": "prima_lab_sa_prima_covid_19_igg_igm_rapid_test_for_professional_use_ce_ivd_78"
            },
            {
                "name": "PRIME4DIA Co., Ltd P4DETECT COVID-19 Ag (RUO) ",
                "id": "prime4dia_co_ltd_p4detect_covid_19_ag_ruo_77"
            },
            {
                "name": "PRIME4DIA Co., Ltd P4DETECT COVID-19 IgM/IgG (RUO) ",
                "id": "prime4dia_co_ltd_p4detect_covid_19_igm_igg_ruo_63"
            },
            {
                "name": "PRIME4DIA Co., Ltd P4DETECT COVID-19 SAg (RUO) ",
                "id": "prime4dia_co_ltd_p4detect_covid_19_sag_ruo_29"
            },
            {
                "name": "Progenie Molecular S.L.U. RealCycler CORO (CE-IVD) ",
                "id": "progenie_molecular_slu_realcycler_coro_ce_ivd_84"
            },
            {
                "name": "Promis Diagnostics SensDtect RT-qPCR SARS CoV-2 (RUO) ",
                "id": "promis_diagnostics_sensdtect_rt_qpcr_sars_cov_2_ruo_45"
            },
            {
                "name": "QIAGEN GmbH QIAstat-Dx Respiratory Panel 2019-nCoV (US FDA-EUA - CE-IVD) ",
                "id": "qiagen_gmbh_qiastat_dx_respiratory_panel_2019_ncov_us_fda_eua___ce_ivd_11"
            },
            {
                "name": "Qingdao Hightop Biotech Co., Ltd Hightop COVID-19 IgM/IgG Ab Rapid Test Kit (in development) ",
                "id": "qingdao_hightop_biotech_co_ltd_hightop_covid_19_igm_igg_ab_rapid_test_kit_in_development_43"
            },
            {
                "name": "Qingdao Jianma Gene Technology Co., Ltd. COVID-19 Nucleic Acid Detection Kit (Rapid PCR Fluorescence Method) (RUO) ",
                "id": "qingdao_jianma_gene_technology_co_ltd_covid_19_nucleic_acid_detection_kit_rapid_pcr_fluorescence_method_ruo_84"
            },
            {
                "name": "Quansys Biosciences Human COVID-19 (2-plex) (in development) ",
                "id": "quansys_biosciences_human_covid_19_2_plex_in_development_66"
            },
            {
                "name": "QuantuMDx QPOC™ Point of Care NAT for SARS-CoV-2 (In development) ",
                "id": "quantumdx_qpoc_point_of_care_nat_for_sars_cov_2_in_development_39"
            },
            {
                "name": "QuantuMDx QuantuMDx NAT for SARS-CoV-2 (In development) ",
                "id": "quantumdx_quantumdx_nat_for_sars_cov_2_in_development_43"
            },
            {
                "name": "Quidel Lyra SARS-CoV-2 Assay (US FDA-EUA)",
                "id": "quidel_lyra_sars_cov_2_assay_us_fda_eua15"
            },
            {
                "name": "QuikPath Pte Ltd QuikPath Covid-19 POC molecular test (in development) ",
                "id": "quikpath_pte_ltd_quikpath_covid_19_poc_molecular_test_in_development_15"
            },
            {
                "name": "Quotient Limited SA MosaiQ™ COVID-19 Antibody Microarray (in development) ",
                "id": "quotient_limited_sa_mosaiq_covid_19_antibody_microarray_in_development_6"
            },
            {
                "name": "RainSure Scientific Co., Ltd RainSure COVID-19 dPCR Detection Kit (lab-based) (RUO) ",
                "id": "rainsure_scientific_co_ltd_rainsure_covid_19_dpcr_detection_kit_lab_based_ruo_38"
            },
            {
                "name": "Randox Laboratories Ltd Extended Coronavirus Array (lab-based or near-POC) (RUO) ",
                "id": "randox_laboratories_ltd_extended_coronavirus_array_lab_based_or_near_poc_ruo_16"
            },
            {
                "name": "Rapid Bio LLC Rapid test for IgM/IgG antibodies against SARS-COV-2 (RUO) ",
                "id": "rapid_bio_llc_rapid_test_for_igm_igg_antibodies_against_sars_cov_2_ruo_6"
            },
            {
                "name": "RapiGEN Inc. BIOCREDIT COVID-19 Ag (CE-IVD) ",
                "id": "rapigen_inc_biocredit_covid_19_ag_ce_ivd_24"
            },
            {
                "name": "RapiGEN Inc. BIOCREDIT COVID-19 IgG (RUO) ",
                "id": "rapigen_inc_biocredit_covid_19_igg_ruo_35"
            },
            {
                "name": "RapiGEN Inc. BIOCREDIT COVID-19 IgG+IgM Duo (CE-IVD) ",
                "id": "rapigen_inc_biocredit_covid_19_igg_igm_duo_ce_ivd_77"
            },
            {
                "name": "RayBiotech Coronavirus (SARS-CoV-2) IgM/IgG Test Kit (Colloidal Gold) (CE-IVD) ",
                "id": "raybiotech_coronavirus_sars_cov_2_igm_igg_test_kit_colloidal_gold_ce_ivd_76"
            },
            {
                "name": "R-Biopharm AG RIDA® GENE SARS-CoV-2 RUO (PG6815RUO) (RUO) ",
                "id": "r_biopharm_ag_rida_gene_sars_cov_2_ruo_pg6815ruo_ruo_32"
            },
            {
                "name": "Regulatory contact",
                "id": "regulatory_contact29"
            },
            {
                "name": "RetroVirox Inc. SARS-CoV-2 Pseudovirus assay for Neutralizing Antibodies (RUO) ",
                "id": "retrovirox_inc_sars_cov_2_pseudovirus_assay_for_neutralizing_antibodies_ruo_5"
            },
            {
                "name": "Ring Biotechnology Co., Ltd COVID-19 IgM/IgG Rapid Test Kit (CE-IVD) ",
                "id": "ring_biotechnology_co_ltd_covid_19_igm_igg_rapid_test_kit_ce_ivd_83"
            },
            {
                "name": "Roche Molecular Diagnostics cobas® SARS-CoV-2 (for use on the cobas® 6800/8800 Systems) (US FDA-EUA - WHO EUL) ",
                "id": "roche_molecular_diagnostics_cobas_sars_cov_2_for_use_on_the_cobas_6800_8800_systems_us_fda_eua___who_eul_16"
            },
            {
                "name": "RPC Diagnostic Systems Anti-SARS-CoV-2 enzyme immunoassay for the detection of antibodies to SARS-CoV-2 (COVID-19) (in development) ",
                "id": "rpc_diagnostic_systems_anti_sars_cov_2_enzyme_immunoassay_for_the_detection_of_antibodies_to_sars_cov_2_covid_19_in_development_25"
            },
            {
                "name": "Sacace BIOTECNOLOGIES SARS-CoV-2 Real-TM (CE-IVD) ",
                "id": "sacace_biotecnologies_sars_cov_2_real_tm_ce_ivd_60"
            },
            {
                "name": "Sansure Biotech, Inc. Novel Coronavirus (2019-nCoV) Nucleic Acid Diagnostic Kit (PCR-Fluorescence Probing) (China FDA–EUA - CE-IVD) ",
                "id": "sansure_biotech_inc_novel_coronavirus_2019_ncov_nucleic_acid_diagnostic_kit_pcr_fluorescence_probing_china_fda_eua___ce_ivd_95"
            },
            {
                "name": "Scope Fluidics SA PCR|COV (in development) ",
                "id": "scope_fluidics_sa_pcr|cov_in_development_27"
            },
            {
                "name": "SD BIOSENSOR Inc. STANDARD M nCoV Real-Time Detection Kit (Korea MFDS–EUA - CE-IVD) ",
                "id": "sd_biosensor_inc_standard_m_ncov_real_time_detection_kit_korea_mfds_eua___ce_ivd_42"
            },
            {
                "name": "SD BIOSENSOR, Inc. STANDARD F COVID-19 Ag FIA (CE-IVD) ",
                "id": "sd_biosensor_inc_standard_f_covid_19_ag_fia_ce_ivd_56"
            },
            {
                "name": "SD BIOSENSOR, Inc. STANDARD Q COVID-19 Ag Test (CE-IVD) ",
                "id": "sd_biosensor_inc_standard_q_covid_19_ag_test_ce_ivd_90"
            },
            {
                "name": "SD BIOSENSOR, Inc. STANDARD Q COVID-19 IgM/IgG Duo Test (CE-IVD) ",
                "id": "sd_biosensor_inc_standard_q_covid_19_igm_igg_duo_test_ce_ivd_39"
            },
            {
                "name": "SEASUN BIOMATERIALS U-TOP™ COVID-19 Detection Kit (Korea MFDS-EUA - CE-IVD) ",
                "id": "seasun_biomaterials_u_top_covid_19_detection_kit_korea_mfds_eua___ce_ivd_69"
            },
            {
                "name": "Seegene, Inc. Allplex 2019-nCoV assay (Korea MFDS-EUA - CE-IVD) ",
                "id": "seegene_inc_allplex_2019_ncov_assay_korea_mfds_eua___ce_ivd_58"
            },
            {
                "name": "Selfdiagnostics Deutschland GmbH Multitest (in development) ",
                "id": "selfdiagnostics_deutschland_gmbh_multitest_in_development_44"
            },
            {
                "name": "Sengenics CoviDx (manual) (RUO) ",
                "id": "sengenics_covidx_manual_ruo_11"
            },
            {
                "name": "SensingSelf, Pte, Ltd, Singapore COVID-19 Rapid IgG/IgM Combined Antigen Assay Pre-screening Test Kit (Model ERCSS05401) (CE-IVD) ",
                "id": "sensingself_pte_ltd_singapore_covid_19_rapid_igg_igm_combined_antigen_assay_pre_screening_test_kit_model_ercss05401_ce_ivd_26"
            },
            {
                "name": "Sente Biolab Senteligo Covid-19 qRT PCR Detection Kit (CE-IVD) ",
                "id": "sente_biolab_senteligo_covid_19_qrt_pcr_detection_kit_ce_ivd_7"
            },
            {
                "name": "Sentinel CH STAT-NAT® Covid-19 HK and STAT-NAT® Covid-19 B (CE-IVD) ",
                "id": "sentinel_ch_stat_nat_covid_19_hk_and_stat_nat_covid_19_b_ce_ivd_91"
            },
            {
                "name": "servoprax GmbH Cleartest Corona, Covid-19 (CE-IVD) ",
                "id": "servoprax_gmbh_cleartest_corona_covid_19_ce_ivd_88"
            },
            {
                "name": "Shaanxi Lifegen Co., Ltd Novel coronavirus (COVID-19) nucleic acid detection kit (fluorescent PCR method) (CE-IVD) ",
                "id": "shaanxi_lifegen_co_ltd_novel_coronavirus_covid_19_nucleic_acid_detection_kit_fluorescent_pcr_method_ce_ivd_40"
            },
            {
                "name": "Shandong Shtars Biological Industry Co., Ltd Novel Coronavirus (SARS-CoV-2) Real Time Multiplex RT-PCR Kit User Manual (RUO) ",
                "id": "shandong_shtars_biological_industry_co_ltd_novel_coronavirus_sars_cov_2_real_time_multiplex_rt_pcr_kit_user_manual_ruo_34"
            },
            {
                "name": "Shanghai Chemtron Biotech Co. Ltd 2019-nCoV IgM Antibody Diagnostic Kit (Colloidal gold) (CE-IVD) ",
                "id": "shanghai_chemtron_biotech_co_ltd_2019_ncov_igm_antibody_diagnostic_kit_colloidal_gold_ce_ivd_69"
            },
            {
                "name": "Shanghai Fosun Long March Medical Science Co.,Ltd. 2019-Novel Coronavirus (2019-nCoV) RT-PCR Detection Kit (RUO) ",
                "id": "shanghai_fosun_long_march_medical_science_co_ltd_2019_novel_coronavirus_2019_ncov_rt_pcr_detection_kit_ruo_52"
            },
            {
                "name": "Shanghai GeneoDx Biotechnology Co., Ltd Novel Coronavirus 2019-nCoV Nucleic Acid Detection Kit (Fluorescent PCR Method) (China FDA–EUA) ",
                "id": "shanghai_geneodx_biotechnology_co_ltd_novel_coronavirus_2019_ncov_nucleic_acid_detection_kit_fluorescent_pcr_method_china_fda_eua_25"
            },
            {
                "name": "Shanghai Igenetec Diagnostics Co., Ltd Novel Coronavirus SARS-CoV-2 Nucleic Acid Detection Kit (Isothermal Amplification on Microfluidic Chip) (RUO) ",
                "id": "shanghai_igenetec_diagnostics_co_ltd_novel_coronavirus_sars_cov_2_nucleic_acid_detection_kit_isothermal_amplification_on_microfluidic_chip_ruo_17"
            },
            {
                "name": "Shanghai Kehua Bio-engineering Co., Ltd SARS-CoV-2 Nucleic Acid Test (RUO) ",
                "id": "shanghai_kehua_bio_engineering_co_ltd_sars_cov_2_nucleic_acid_test_ruo_9"
            },
            {
                "name": "Shanghai Outdo Biotech Co., Ltd Novel Coronavirus (SARS-CoV-2) Antibody (IgM / IgG) Test (Colloidal Gold) (China FDA-EUA - CE-IVD) ",
                "id": "shanghai_outdo_biotech_co_ltd_novel_coronavirus_sars_cov_2_antibody_igm___igg_test_colloidal_gold_china_fda_eua___ce_ivd_85"
            },
            {
                "name": "Shanghai Rendu Biotechnology Co., Ltd AmpSure 2019-nCov RNA Assay (RUO)",
                "id": "shanghai_rendu_biotechnology_co_ltd_ampsure_2019_ncov_rna_assay_ruo13"
            },
            {
                "name": "Shanghai ZJ Bio-Tech Co., Ltd/Liferiver Liferiver Novel Coronavirus (2019-nCoV) Real Time Multiplex RT-PCRT kit (China FDA–EUA - CE-IVD) ",
                "id": "shanghai_zj_bio_tech_co_ltd_liferiver_liferiver_novel_coronavirus_2019_ncov_real_time_multiplex_rt_pcrt_kit_china_fda_eua___ce_ivd_53"
            },
            {
                "name": "ShanXi Medical University SARS-COV-2 IgM/IgG antibody test (Colloidal Gold) (RUO) ",
                "id": "shanxi_medical_university_sars_cov_2_igm_igg_antibody_test_colloidal_gold_ruo_61"
            },
            {
                "name": "Shenzhen Bioeasy Biotechnology Co., Ltd Bioeasy 2019-nCoV Ag Fluorescence Rapid Test Kit (Time-Resolved Fluorescence) (CE-IVD) ",
                "id": "shenzhen_bioeasy_biotechnology_co_ltd_bioeasy_2019_ncov_ag_fluorescence_rapid_test_kit_time_resolved_fluorescence_ce_ivd_40"
            },
            {
                "name": "Shenzhen Bioeasy Biotechnology Co., Ltd Bioeasy 2019-nCoV Total Ab GICA Rapid Test (CE-IVD) ",
                "id": "shenzhen_bioeasy_biotechnology_co_ltd_bioeasy_2019_ncov_total_ab_gica_rapid_test_ce_ivd_65"
            },
            {
                "name": "Shenzhen Bioeasy Biotechnology Co., Ltd Bioeasy 2019-Novel Coronavirus (2019-nCoV) Ag GICA Rapid Test – WITHDRAWN",
                "id": "shenzhen_bioeasy_biotechnology_co_ltd_bioeasy_2019_novel_coronavirus_2019_ncov_ag_gica_rapid_test___withdrawn23"
            },
            {
                "name": "Shenzhen Puruikang Biotech Co., Ltd Detection Kit for 2019-Novel Coronavirus RNA (RT-PCR-Fluorescence Probing) (CE-IVD) ",
                "id": "shenzhen_puruikang_biotech_co_ltd_detection_kit_for_2019_novel_coronavirus_rna_rt_pcr_fluorescence_probing_ce_ivd_40"
            },
            {
                "name": "Shenzhen Tailored Medical Ltd New Coronavirus (SARS-CoV-2) Nucleic Acid Detection Kit (PCR-Fluorescent Probe Method) (CE-IVD) ",
                "id": "shenzhen_tailored_medical_ltd_new_coronavirus_sars_cov_2_nucleic_acid_detection_kit_pcr_fluorescent_probe_method_ce_ivd_20"
            },
            {
                "name": "Shenzhen Tailored Medical Ltd Novel Coronavirus (SARS-CoV-2) IgM/IgG Antibody Assay Kit (Colloidal Gold Method) (CE-IVD) ",
                "id": "shenzhen_tailored_medical_ltd_novel_coronavirus_sars_cov_2_igm_igg_antibody_assay_kit_colloidal_gold_method_ce_ivd_77"
            },
            {
                "name": "Shenzhen Yhlo Biotech Co. Ltd iFlash-SARS-CoV-2 IgG (CE-IVD) ",
                "id": "shenzhen_yhlo_biotech_co_ltd_iflash_sars_cov_2_igg_ce_ivd_63"
            },
            {
                "name": "Shenzhen Yhlo Biotech Co. Ltd iFlash-SARS-CoV-2 IgM (CE-IVD) ",
                "id": "shenzhen_yhlo_biotech_co_ltd_iflash_sars_cov_2_igm_ce_ivd_24"
            },
            {
                "name": "Shenzhen Zhenrui Biotech Co., Ltd COVID-19 IgGg/IgM Rapid Test Cassette (WB/S/P) (CE-IVD) ",
                "id": "shenzhen_zhenrui_biotech_co_ltd_covid_19_iggg_igm_rapid_test_cassette_wb_s_p_ce_ivd_6"
            },
            {
                "name": "Sherlock Biosciences Sherlock™ CRISPR SARS-CoV-2 (in development) ",
                "id": "sherlock_biosciences_sherlock_crispr_sars_cov_2_in_development_75"
            },
            {
                "name": "SignalDT Biotechnologies (SZ), Inc. LyoDx® A Freeze-Dried Real-Time RT-PCR Detection Reagent for SARS-CoV-2 (in development) ",
                "id": "signaldt_biotechnologies_sz_inc_lyodx_a_freeze_dried_real_time_rt_pcr_detection_reagent_for_sars_cov_2_in_development_20"
            },
            {
                "name": "Snibe Co., Ltd (Shenzhen New Industries Biomedical Engineering Co., Ltd) MAGLUMI 2019-nCoV IgG (CLIA) (CE-IVD) ",
                "id": "snibe_co_ltd_shenzhen_new_industries_biomedical_engineering_co_ltd_maglumi_2019_ncov_igg_clia_ce_ivd_65"
            },
            {
                "name": "Snibe Co., Ltd (Shenzhen New Industries Biomedical Engineering Co., Ltd) MAGLUMI 2019-nCoV IgM (CLIA) (CE-IVD) ",
                "id": "snibe_co_ltd_shenzhen_new_industries_biomedical_engineering_co_ltd_maglumi_2019_ncov_igm_clia_ce_ivd_24"
            },
            {
                "name": "Solgent Co.Ltd DiaPlexQ™ Novel Coronavirus (2019-nCoV) Detection Kit (Korea FDA-EUA - CE-IVD) ",
                "id": "solgent_coltd_diaplexq_novel_coronavirus_2019_ncov_detection_kit_korea_fda_eua___ce_ivd_25"
            },
            {
                "name": "Sona Nanotech Sona-COVID-19 LFA (in development) ",
                "id": "sona_nanotech_sona_covid_19_lfa_in_development_3"
            },
            {
                "name": "Spectrum for Diagnostic Industries (SDI) SARS-CoV-2 Qualitative Real Time PCR Kit (RUO) ",
                "id": "spectrum_for_diagnostic_industries_sdi_sars_cov_2_qualitative_real_time_pcr_kit_ruo_5"
            },
            {
                "name": "Spring Healthcare Services AG COVID-19 IgG/IgM Rapid Test (colloidal gold-based) (CE-IVD) ",
                "id": "spring_healthcare_services_ag_covid_19_igg_igm_rapid_test_colloidal_gold_based_ce_ivd_61"
            },
            {
                "name": "St. Petersburg Research Institute of Vaccines and Sera (FSUE SPbSRIVS FMBA) SARS-CoV-2 Tru-EIA (In development) ",
                "id": "st_petersburg_research_institute_of_vaccines_and_sera_fsue_spbsrivs_fmba_sars_cov_2_tru_eia_in_development_88"
            },
            {
                "name": "Star Array Ptd. Ltd 8-minute RT-qPCR direct PCR testing system for SARS-CoV-2 detection (RUO) ",
                "id": "star_array_ptd_ltd_8_minute_rt_qpcr_direct_pcr_testing_system_for_sars_cov_2_detection_ruo_34"
            },
            {
                "name": "STILLA COVID-19 Multiplex Crystal Digital PCR detection kit (In development) ",
                "id": "stilla_covid_19_multiplex_crystal_digital_pcr_detection_kit_in_development_33"
            },
            {
                "name": "Sugentech, Inc. SGTi-flex COVID-19 IgG (RDT) (CE-IVD) ",
                "id": "sugentech_inc_sgti_flex_covid_19_igg_rdt_ce_ivd_99"
            },
            {
                "name": "Sugentech, Inc. SGTi-flex COVID-19 IgM (manual) (CE-IVD) ",
                "id": "sugentech_inc_sgti_flex_covid_19_igm_manual_ce_ivd_74"
            },
            {
                "name": "Sugentech, Inc. SGTi-flex COVID-19 IgM (RDT) (CE-IVD) ",
                "id": "sugentech_inc_sgti_flex_covid_19_igm_rdt_ce_ivd_89"
            },
            {
                "name": "Sugentech, Inc. SGTi-flex COVID-19 IgM/IgG (manual) (CE-IVD) ",
                "id": "sugentech_inc_sgti_flex_covid_19_igm_igg_manual_ce_ivd_94"
            },
            {
                "name": "Sugentech, Inc. SGTi-flex COVID-19 IgM/IgG (manual) (CE-IVD) ",
                "id": "sugentech_inc_sgti_flex_covid_19_igm_igg_manual_ce_ivd_98"
            },
            {
                "name": "Sugentech, Inc. SGTi-flex COVID-19 IgM/IgG (RDT) (CE-IVD) ",
                "id": "sugentech_inc_sgti_flex_covid_19_igm_igg_rdt_ce_ivd_93"
            },
            {
                "name": "SunStar Joint Stock Company LAMP-COVID-19 (RUO) ",
                "id": "sunstar_joint_stock_company_lamp_covid_19_ruo_95"
            },
            {
                "name": "Sure Bio-Tech (USA) Co., Ltd SARS-CoV-2 IgG Ab Rapid Test (CE-IVD) ",
                "id": "sure_bio_tech_usa_co_ltd_sars_cov_2_igg_ab_rapid_test_ce_ivd_67"
            },
            {
                "name": "Sure Bio-Tech (USA) Co., Ltd SARS-CoV-2 IgM Ab Rapid Test (CE-IVD) ",
                "id": "sure_bio_tech_usa_co_ltd_sars_cov_2_igm_ab_rapid_test_ce_ivd_50"
            },
            {
                "name": "Sure Bio-Tech (USA) Co., Ltd SARS-CoV-2 IgM/IgG Ab Rapid Test (CE-IVD) ",
                "id": "sure_bio_tech_usa_co_ltd_sars_cov_2_igm_igg_ab_rapid_test_ce_ivd_95"
            },
            {
                "name": "Suzhou BTA Biotech Co. Ltd Real time RT-PCR Kit for the detection of SARS-CoV-2 (China-FDA EUA) ",
                "id": "suzhou_bta_biotech_co_ltd_real_time_rt_pcr_kit_for_the_detection_of_sars_cov_2_china_fda_eua_26"
            },
            {
                "name": "Syrona Limited COVID-19 IgG/IgM Rapid Test Cassette (CE-IVD) ",
                "id": "syrona_limited_covid_19_igg_igm_rapid_test_cassette_ce_ivd_55"
            },
            {
                "name": "Systaaq Diagnostic Prouducts 2019-Novel Coronavirus (COVID-19) Real Time PCR Kit (CE-IVD)",
                "id": "systaaq_diagnostic_prouducts_2019_novel_coronavirus_covid_19_real_time_pcr_kit_ce_ivd78"
            },
            {
                "name": "Taizhou ZECEN Biotech Co., Ltd SARS-CoV-2 IgG (CE-IVD) ",
                "id": "taizhou_zecen_biotech_co_ltd_sars_cov_2_igg_ce_ivd_77"
            },
            {
                "name": "Taizhou ZECEN Biotech Co., Ltd SARS-CoV-2 IgM (CE-IVD) ",
                "id": "taizhou_zecen_biotech_co_ltd_sars_cov_2_igm_ce_ivd_49"
            },
            {
                "name": "TargetingOne Novel Coronavirus (SARS-CoV-2) nucleic acid detection kit (Digital PCR method) (RUO) ",
                "id": "targetingone_novel_coronavirus_sars_cov_2_nucleic_acid_detection_kit_digital_pcr_method_ruo_42"
            },
            {
                "name": "Telepoint Medical Services LLC Telepoint Medical Services SARS-CoV-2 IgG/IgM Rapid Qualitative Test (RUO) ",
                "id": "telepoint_medical_services_llc_telepoint_medical_services_sars_cov_2_igg_igm_rapid_qualitative_test_ruo_76"
            },
            {
                "name": "Tellgen Corporation SARS-CoV-2 Nucleic acids detection kit based on Real-Time PCR platform (CE-IVD) ",
                "id": "tellgen_corporation_sars_cov_2_nucleic_acids_detection_kit_based_on_real_time_pcr_platform_ce_ivd_41"
            },
            {
                "name": "Test description in Spanish",
                "id": "test_description_in_spanish19"
            },
            {
                "name": "Tetracore Inc. Multiplex detection and differentiation SARS-Cov-2 Serology Assay (manual) (RUO) ",
                "id": "tetracore_inc_multiplex_detection_and_differentiation_sars_cov_2_serology_assay_manual_ruo_16"
            },
            {
                "name": "Thermo Fisher Scientific TaqManTM SARS-CoV-2 Assay Kit v2 (RUO) ",
                "id": "thermo_fisher_scientific_taqmantm_sars_cov_2_assay_kit_v2_ruo_17"
            },
            {
                "name": "Thermo Fisher Scientific TaqPath COVID-19 Combo Kit (USA FDA-EUA) ",
                "id": "thermo_fisher_scientific_taqpath_covid_19_combo_kit_usa_fda_eua_30"
            },
            {
                "name": "Tianjin Era Biology Technology Co., Ltd COVID-19 IgG Lateral Flow Assay (CE-IVD) ",
                "id": "tianjin_era_biology_technology_co_ltd_covid_19_igg_lateral_flow_assay_ce_ivd_68"
            },
            {
                "name": "Tianjin Era Biology Technology Co., Ltd COVID-19 IgM Lateral Flow Assay (CE-IVD) ",
                "id": "tianjin_era_biology_technology_co_ltd_covid_19_igm_lateral_flow_assay_ce_ivd_87"
            },
            {
                "name": "Tianjin Era Biology Technology Co., Ltd COVID-19 IgM/IgG Lateral Flow Assay (CE-IVD) ",
                "id": "tianjin_era_biology_technology_co_ltd_covid_19_igm_igg_lateral_flow_assay_ce_ivd_12"
            },
            {
                "name": "Tianjin Jianbo Biological Co., Ltd SARS-CoV-2 Specific IgM and IgG Test Kit (Coillodal Gold) (RUO) ",
                "id": "tianjin_jianbo_biological_co_ltd_sars_cov_2_specific_igm_and_igg_test_kit_coillodal_gold_ruo_89"
            },
            {
                "name": "Tianjin MNCHIP Technologies Co., Ltd Anti-COVID-19 virus IgM/IgG rapid test kit (Colloidal gold assay) (CE-IVD) ",
                "id": "tianjin_mnchip_technologies_co_ltd_anti_covid_19_virus_igm_igg_rapid_test_kit_colloidal_gold_assay_ce_ivd_85"
            },
            {
                "name": "Tianjin MNCHIP Technologies Co., Ltd. Anti-COVID-19 virus IgM/IgG rapid test kit (Colloidal gold assay) (CE-IVD) ",
                "id": "tianjin_mnchip_technologies_co_ltd_anti_covid_19_virus_igm_igg_rapid_test_kit_colloidal_gold_assay_ce_ivd_29"
            },
            {
                "name": "Twist Bioscience NGS-based target capture for SARS-CoV-2 detection and screening (In development) ",
                "id": "twist_bioscience_ngs_based_target_capture_for_sars_cov_2_detection_and_screening_in_development_61"
            },
            {
                "name": "U2USystems (India) Pvt. Ltd 2019-ncoV IgG/IgM Test (CE-IVD) ",
                "id": "u2usystems_india_pvt_ltd_2019_ncov_igg_igm_test_ce_ivd_77"
            },
            {
                "name": "University of Washington Tongue swab diagnosis of SARS-CoV-2 (In development) ",
                "id": "university_of_washington_tongue_swab_diagnosis_of_sars_cov_2_in_development_2"
            },
            {
                "name": "Ustar Biotechnologies (Hangzhou) Ltd EasyNAT Integrated, Automated Molecular Diagnostic Assay for COVID-19 RNA (RUO) ",
                "id": "ustar_biotechnologies_hangzhou_ltd_easynat_integrated_automated_molecular_diagnostic_assay_for_covid_19_rna_ruo_60"
            },
            {
                "name": "Veredus Laboratories Pte Ltd VereCoV™ Detection Kit and VerePLEX™ Biosystem (Singapore HSA - CE-IVD) ",
                "id": "veredus_laboratories_pte_ltd_verecov_detection_kit_and_vereplex_biosystem_singapore_hsa___ce_ivd_63"
            },
            {
                "name": "Veredus Laboratories Pte Ltd VereCoV™ Detection Kit and VerePLEX™ Biosystem (Singapore HSA) ",
                "id": "veredus_laboratories_pte_ltd_verecov_detection_kit_and_vereplex_biosystem_singapore_hsa_55"
            },
            {
                "name": "Verify Diagnostics Inc. Covid-19 IgG/IgM Antibody Test (RUO) ",
                "id": "verify_diagnostics_inc_covid_19_igg_igm_antibody_test_ruo_65"
            },
            {
                "name": "Vircell S.L. COVID-19 ELISA IgG (CE-IVD) ",
                "id": "vircell_sl_covid_19_elisa_igg_ce_ivd_21"
            },
            {
                "name": "Vircell S.L. COVID-19 ELISA IgM+IgA (CE-IVD) ",
                "id": "vircell_sl_covid_19_elisa_igm_iga_ce_ivd_29"
            },
            {
                "name": "Vircell S.L. COVID-19 VIRCLIA® IgG MONOTEST (RUO) ",
                "id": "vircell_sl_covid_19_virclia_igg_monotest_ruo_46"
            },
            {
                "name": "Vircell S.L. COVID-19 VIRCLIA® IgM+IgA MONOTEST (RUO) ",
                "id": "vircell_sl_covid_19_virclia_igm_iga_monotest_ruo_92"
            },
            {
                "name": "Vircell, S.L. AMPLIRUN® CORONAVIRUS SARS (2003) RNA CONTROL (RUO) ",
                "id": "vircell_sl_amplirun_coronavirus_sars_2003_rna_control_ruo_66"
            },
            {
                "name": "Vircell, S.L. AMPLIRUN® SARS-CoV-2 RNA CONTROL (RUO) ",
                "id": "vircell_sl_amplirun_sars_cov_2_rna_control_ruo_51"
            },
            {
                "name": "Vircell, S.L. AMPLIRUN® TOTAL SARS-CoV-2 CONTROL (SWAB) (in development) ",
                "id": "vircell_sl_amplirun_total_sars_cov_2_control_swab_in_development_8"
            },
            {
                "name": "Vircell, S.L. SARS-COV-2 REALTIME PCR KIT (CE-IVD) ",
                "id": "vircell_sl_sars_cov_2_realtime_pcr_kit_ce_ivd_86"
            },
            {
                "name": "Vision Biotechnology Research & Development VISION COVID19 Easyprep Test Kit (IFA ISO 9001: 2015) ",
                "id": "vision_biotechnology_research___development_vision_covid19_easyprep_test_kit_ifa_iso_9001__2015_68"
            },
            {
                "name": "Vitassay Healthcare S.L. Vitassay qPCR SARS-CoV-2 (CE-IVD) ",
                "id": "vitassay_healthcare_sl_vitassay_qpcr_sars_cov_2_ce_ivd_33"
            },
            {
                "name": "VivaChek Biotech (Hangzhou) Co., Ltd VivaDiag COVID-19 IgM/IgG Rapid Test (CE-IVD) ",
                "id": "vivachek_biotech_hangzhou_co_ltd_vivadiag_covid_19_igm_igg_rapid_test_ce_ivd_81"
            },
            {
                "name": "VivaChek Biotech (Hangzhou) Co., Ltd VivaDiag COVID-19 IgM/IgG Rapid Test (CE-IVD) ",
                "id": "vivachek_biotech_hangzhou_co_ltd_vivadiag_covid_19_igm_igg_rapid_test_ce_ivd_68"
            },
            {
                "name": "Wells Bio, Inc. careGENE™ COVID-19 RT-PCR kit (Korea MFDS - CE-IVD) ",
                "id": "wells_bio_inc_caregene_covid_19_rt_pcr_kit_korea_mfds___ce_ivd_39"
            },
            {
                "name": "Wells Bio, Inc. careGENE™ N-CoV RT-PCR kit (Korea MFDS - CE-IVD) ",
                "id": "wells_bio_inc_caregene_n_cov_rt_pcr_kit_korea_mfds___ce_ivd_8"
            },
            {
                "name": "Wells Bio, Inc. careUS™ COVID-19 IgM/IgG (in development) ",
                "id": "wells_bio_inc_careus_covid_19_igm_igg_in_development_26"
            },
            {
                "name": "Willi Fox GmbH Willi Fox Covid-19 IgM/ IgG rapid test (CE-IVD) ",
                "id": "willi_fox_gmbh_willi_fox_covid_19_igm__igg_rapid_test_ce_ivd_76"
            },
            {
                "name": "Wuhan EasyDiagnosis Biomedicine Co., Ltd Novel Coronavirus IgG antibody test kit (colloidal gold method) (CE-IVD) ",
                "id": "wuhan_easydiagnosis_biomedicine_co_ltd_novel_coronavirus_igg_antibody_test_kit_colloidal_gold_method_ce_ivd_83"
            },
            {
                "name": "Wuhan EasyDiagnosis Biomedicine Co., Ltd Novel Coronavirus IgM antibody test kit (colloidal gold method) (CE-IVD) ",
                "id": "wuhan_easydiagnosis_biomedicine_co_ltd_novel_coronavirus_igm_antibody_test_kit_colloidal_gold_method_ce_ivd_12"
            },
            {
                "name": "Wuhan Easydiagnosis Biomedicine Co., Ltd SARS-CoV-2 nucleic acid test kit (China FDA–EUA - CE-IVD) ",
                "id": "wuhan_easydiagnosis_biomedicine_co_ltd_sars_cov_2_nucleic_acid_test_kit_china_fda_eua___ce_ivd_87"
            },
            {
                "name": "Wuhan EasyDiagnosis Biomedicine Co.,Ltd Novel Coronavirus IgG antibody test kit (colloidal gold method) (CE-IVD) ",
                "id": "wuhan_easydiagnosis_biomedicine_co_ltd_novel_coronavirus_igg_antibody_test_kit_colloidal_gold_method_ce_ivd_79"
            },
            {
                "name": "Wuhan EasyDiagnosis Biomedicine Co.,Ltd Novel Coronavirus IgM antibody test kit (colloidal gold method) (CE-IVD) ",
                "id": "wuhan_easydiagnosis_biomedicine_co_ltd_novel_coronavirus_igm_antibody_test_kit_colloidal_gold_method_ce_ivd_98"
            },
            {
                "name": "Wuhan HealthCare Biotechnology Co., Ltd Corona Virus Disease 2019 (COVID-19) Nucleic Acid Detection Kit (CE-IVD) ",
                "id": "wuhan_healthcare_biotechnology_co_ltd_corona_virus_disease_2019_covid_19_nucleic_acid_detection_kit_ce_ivd_60"
            },
            {
                "name": "Wuhan UNscience Biotechnology Co., Ltd Covid-19 IgG/IgM Antibody Rapid Test Kit (CE-IVD) ",
                "id": "wuhan_unscience_biotechnology_co_ltd_covid_19_igg_igm_antibody_rapid_test_kit_ce_ivd_75"
            },
            {
                "name": "Wuxi Shenrui Bio-pharmaceuticals Co. Ltd Covflu-SR, Coronavirus 2019-nCoV and influenza virus A/B nucleic acid detection (in development) ",
                "id": "wuxi_shenrui_bio_pharmaceuticals_co_ltd_covflu_sr_coronavirus_2019_ncov_and_influenza_virus_a_b_nucleic_acid_detection_in_development_25"
            },
            {
                "name": "Xi’an Tianlong Science and Technology Co., Ltd COVID-19 ORF1ab/N Gene PCR Detection Kit (RUO) ",
                "id": "xi_an_tianlong_science_and_technology_co_ltd_covid_19_orf1ab_n_gene_pcr_detection_kit_ruo_53"
            },
            {
                "name": "Xiamen Biotime Biotechnology Co., Ltd SARS-CoV-2 IgG/IgM Rapid Qualitative Test Kit (CE-IVD) ",
                "id": "xiamen_biotime_biotechnology_co_ltd_sars_cov_2_igg_igm_rapid_qualitative_test_kit_ce_ivd_87"
            },
            {
                "name": "Xiamen Boson Biotech Co. Ltd Rapid 2019-nCoV IgG/IgM Combo Test Card (CCE-IVD) ",
                "id": "xiamen_boson_biotech_co_ltd_rapid_2019_ncov_igg_igm_combo_test_card_cce_ivd_59"
            },
            {
                "name": "Xiamen Wiz Biotech Co. Ltd Diagnostic Kit (Colloidal Gold) for IgG/IgM Antibody to SARS-COV-2 (CE-IVD) ",
                "id": "xiamen_wiz_biotech_co_ltd_diagnostic_kit_colloidal_gold_for_igg_igm_antibody_to_sars_cov_2_ce_ivd_83"
            },
            {
                "name": "Xiamen Zeesan Biotech Co., Ltd. SARS-CoV-2 Test Kit (CE-IVD) ",
                "id": "xiamen_zeesan_biotech_co_ltd_sars_cov_2_test_kit_ce_ivd_100"
            },
            {
                "name": "Xi'an Goldmag Nanobio Tech Co., Ltd Real-Time RT-PCR assays for the detection of SARS-CoV-2 (CE-IVD) ",
                "id": "xi_an_goldmag_nanobio_tech_co_ltd_real_time_rt_pcr_assays_for_the_detection_of_sars_cov_2_ce_ivd_49"
            },
            {
                "name": "Yaneng BIOscience (Shenzhen) Co., Ltd COVID-19 Nucleic Acid Detection Kit (Multiplex Real Time PCR) (RUO) ",
                "id": "yaneng_bioscience_shenzhen_co_ltd_covid_19_nucleic_acid_detection_kit_multiplex_real_time_pcr_ruo_16"
            },
            {
                "name": "YouSeq Ltd YouSeq SARS-COV-2 qPCR Test (RUO) ",
                "id": "youseq_ltd_youseq_sars_cov_2_qpcr_test_ruo_79"
            },
            {
                "name": "Yuno Diagnostics Co., Ltd Novel coronavirus(SARS-CoV-2) IgG/IgM Antibody Combined Test Kits (CE-IVD) ",
                "id": "yuno_diagnostics_co_ltd_novel_coronavirussars_cov_2_igg_igm_antibody_combined_test_kits_ce_ivd_52"
            },
            {
                "name": "Zalgen Labs, LLC ReSARS CoV-2 Antigen ELISA Kit (in development) ",
                "id": "zalgen_labs_llc_resars_cov_2_antigen_elisa_kit_in_development_41"
            },
            {
                "name": "Zalgen Labs, LLC ReSARS CoV-2 Antigen Rapid Test (in development) ",
                "id": "zalgen_labs_llc_resars_cov_2_antigen_rapid_test_in_development_27"
            },
            {
                "name": "Zalgen Labs, LLC ReSARS CoV-2 IgM ELISA Kit (in development) ",
                "id": "zalgen_labs_llc_resars_cov_2_igm_elisa_kit_in_development_71"
            },
            {
                "name": "Zalgen Labs, LLC ReSARS Pan-Corona Antigen ELISA Kit (in development) ",
                "id": "zalgen_labs_llc_resars_pan_corona_antigen_elisa_kit_in_development_11"
            },
            {
                "name": "Zalgen Labs, LLC ReSARS Pan-Corona IgM ELISA Kit (in development) ",
                "id": "zalgen_labs_llc_resars_pan_corona_igm_elisa_kit_in_development_93"
            },
            {
                "name": "Zalgen Labs, LLC ReSARS Pan-Corona Rapid Test (in development) ",
                "id": "zalgen_labs_llc_resars_pan_corona_rapid_test_in_development_87"
            },
            {
                "name": "Zhejiang Gene Science Co., Ltd Novel Coronavirus (2019-nCoV) IgM/IgG Antibodies Detection Kit (CE-IVD) ",
                "id": "zhejiang_gene_science_co_ltd_novel_coronavirus_2019_ncov_igm_igg_antibodies_detection_kit_ce_ivd_18"
            },
            {
                "name": "Zhengzhou Humanwell Biocell Biotechnology Co., Ltd BIOCELL COVID-19 IgG ELISA test (RUO) ",
                "id": "zhengzhou_humanwell_biocell_biotechnology_co_ltd_biocell_covid_19_igg_elisa_test_ruo_8"
            },
            {
                "name": "Zhengzhou Humanwell Biocell Biotechnology Co., Ltd BIOCELL COVID-19 IgM ELISA test (RUO) ",
                "id": "zhengzhou_humanwell_biocell_biotechnology_co_ltd_biocell_covid_19_igm_elisa_test_ruo_25"
            },
            {
                "name": "Zhuhai Haitai Biological Pharmaceutical Co., ltd Novel Coronavirus (2019-nCoV)/Flu A/Flu B Real-time Multiplex RT-PCR Kit (manual & automated lab-based) (RUO) ",
                "id": "zhuhai_haitai_biological_pharmaceutical_co_ltd_novel_coronavirus_2019_ncov_flu_a_flu_b_real_time_multiplex_rt_pcr_kit_manual___automated_lab_based_ruo_64"
            },
            {
                "name": "Zhuhai Livzon Diagnostics Inc Diagnostic Kit for IgM Antibody to Corona Virus(nCoV-2019) (Colloidal Gold) (China FDA) ",
                "id": "zhuhai_livzon_diagnostics_inc_diagnostic_kit_for_igm_antibody_to_corona_virusncov_2019_colloidal_gold_china_fda_75"
            },
            {
                "name": "Zhuhai Livzon Diagnostics Inc. Diagnostic Kit for Nucleic Acid to nCoV-2019 (PCR- Fluorescence Probe) (RUO) ",
                "id": "zhuhai_livzon_diagnostics_inc_diagnostic_kit_for_nucleic_acid_to_ncov_2019_pcr__fluorescence_probe_ruo_68"
            },
            {
                "name": "Zugotech Labs Ltd Zugotech COVID-19 IgM/IgG Rapid Test (in development) ",
                "id": "zugotech_labs_ltd_zugotech_covid_19_igm_igg_rapid_test_in_development_72"
            },
            {
                "name": "Zybio, Inc. SARS-CoV-2 Nucleic Acid Detection Kit (PCR-Fluorescent Probe Method) (CE-IVD)",
                "id": "zybio_inc_sars_cov_2_nucleic_acid_detection_kit_pcr_fluorescent_probe_method_ce_ivd"
            }
        ],
        "molecularconcerns-options": [
            {
                "name": "Establishing procedures/ guidelines on specimen collection/ shipping/ storage ",
                "id": "establishing_procedures_guidelines_specimen_collection_shipping_storage"
            },
            {
                "name": "Insufficient viral transport media",
                "id": "insufficient_viral_transport_media"
            },
            {
                "name": "Establishing/ designing the standard detection methods",
                "id": "establishing_designing_standard_detection_methods"
            },
            {
                "name": "Insufficient personal protective equipment (PPE)",
                "id": "insufficient_personal_protective_equipment_ppe"
            },
            {
                "name": "Insufficient equipment",
                "id": "insufficient_equipment"
            },
            {
                "name": "Insufficient primers/ probes/ testing reagent",
                "id": "insufficient_primers_probes_testing_reagent"
            },
            {
                "name": "Insufficient positive control",
                "id": " insufficient_positive_control"
            },
            {
                "name": "Need for specific staff training",
                "id": "need_for_specific_staff_training"
            },
            {
                "name": "Operate in proper biosafety level as required by national legislation",
                "id": "operate_in_proper_biosafety_level_as_required_by_national_legislation"
            },
            {
                "name": "Operate in compliance with the quality management system. (Please indicate if applicable):",
                "id": "operate_in_compliance_with_the_quality_management_system_indicate_if_applicable"
            }
        ],
        "gene_option": [
            {
                "name": "Orf1 ab",
                "id": "Orf1 ab"
            },
            {
                "name": "Orf1b",
                "id": "Orf1b"
            },
            {
                "name": "Orf1b-nsp14",
                "id": "Orf1b-nsp14"
            },
            {
                "name": "E",
                "id": "E"
            },
            {
                "name": "N",
                "id": "N"
            },
            {
                "name": "RdRP",
                "id": "RdRP"
            },
            {
                "name": "s",
                "id": "S"
            },
            {
                "name": "Pancorona",
                "id": "Pancorona"
            },
            {
                "name": "Others: please type in free text",
                "id": "other_gene_option"
            }
        ],
        "specimen_sources-options": [
            {
                "name": "Outbreak investigation (including those meeting case definition and contact tracing)",
                "id": "Outbreak investigation (including those meeting case definition and contact tracing)"
            },
            {
                "name": "Specimens from influenza surveillance",
                "id": "Specimens from influenza surveillance"
            },
            {
                "name": "Others, please specify:",
                "id": "Others, please specify:"
            },
            {
                "name": "Unknown, please explain:",
                "id": "Unknown, please explain:"
            }
        ],
        "heat_inactivation_method_options": [
            {
                "name": "Water bath",
                "id": "water_bath"
            },
            {
                "name": "Dry heat",
                "id": "dry_heat"
            }
        ],
        "daily-sample-load-options": [
            {
                "name": "< 50",
                "id": "< 50"
            },
            {
                "name": "51-200",
                "id": "51-200"
            },
            {
                "name": "201-500",
                "id": "201-500"
            },
            {
                "name": "501-1000",
                "id": "501-1000"
            },
            {
                "name": "1001-2000",
                "id": "1001-2000"
            },
            {
                "name": ">2000",
                "id": ">2000"
            }
        ],
        "common-specimen-options": [
            {
                "name": "Nasopharyngeal swab",
                "id": "Nasopharyngeal swab"
            },
            {
                "name": "Nasal swab",
                "id": "Nasal swab"
            },
            {
                "name": "Throat swab",
                "id": "Throat swab"
            },
            {
                "name": " Sputum",
                "id": " Sputum"
            },
            {
                "name": "Tracheal aspirate",
                "id": "Tracheal aspirate"
            },
            {
                "name": "Saliva",
                "id": "Saliva"
            },
            {
                "name": "Bronchoalveolar lavage",
                "id": "Bronchoalveolar lavage"
            },
            {
                "name": "Stool",
                "id": "Stool"
            },
            {
                "name": "Urine",
                "id": "Urine"
            },
            {
                "name": "Blood",
                "id": "Blood"
            },
            {
                "name": "Others, please specify:",
                "id": "Others, please specify:"
            }
        ],
        "tat-options": [
            {
                "name": "< 24h",
                "id": "< 24h"
            },
            {
                "name": "25h - 48h",
                "id": "25h - 48h"
            },
            {
                "name": "49h - 72h",
                "id": "49h - 72h"
            },
            {
                "name": "After 72h",
                "id": "After 72h"
            }
        ],
        "bsl-pcr-options": [
            {
                "name": "Biosecurity level: BSL2",
                "id": "Biosecurity level: BSL2"
            },
            {
                "name": "Biosecurity level: BSL3",
                "id": "Biosecurity level: BSL3"
            },
            {
                "name": "Unknown",
                "id": "Unknown"
            }
        ],
        "qc-options": [
            {
                "name": "Extraction control",
                "id": "Extraction control"
            },
            {
                "name": "Positive control for PCR",
                "id": "Positive control for PCR"
            },
            {
                "name": "Negative control for PCR",
                "id": "Negative control for PCR"
            },
            {
                "name": "Internal (inhibitor) control for PCR",
                "id": "Internal (inhibitor) control for PCR"
            },
            {
                "name": "Not applicable",
                "id": "Not applicable"
            }
        ],
        "respiratory-options": [
            {
                "name": "Other human coronaviruses",
                "id": "Other human coronaviruses"
            },
            {
                "name": "Other common respiratory pathogens e.g. seasonal influenza viruses",
                "id": "Other common respiratory pathogens e.g. seasonal influenza viruses"
            },
            {
                "name": "Commercial kit: as specified by the manufacturer",
                "id": "Commercial kit: as specified by the manufacturer"
            },
            {
                "name": "Validation in progress. (Please specify if applicable):",
                "id": "Validation in progress. (Please specify if applicable):"
            }
        ],
        "gender_options": [
            {
                "name": "Male",
                "id": "M"
            },
            {
                "name": "Female",
                "id": "F"
            },
            {
                "name": "Other",
                "id": "O"
            }
        ],
        "yes_no_options": [
            {
                "name": "Yes",
                "id": "Yes"
            },
            {
                "name": "No",
                "id": "No"
            }
        ],
        "algorithm_options": [
            {
                "name": "For confirmation",
                "id": "for_confirmation"
            },
            {
                "name": "Parallel run with other essay",
                "id": "parallel_run_with_other_essay"
            },
            {
                "name": "Single assay for detection",
                "id": "single_assay_for_detection"
            },
            {
                "name": "Not applicable",
                "id": "not_applicable"
            },
            {
                "name": "Others (please type in free text)",
                "id": "others"
            },
        ],
        "brand_options": [
            {
                name: "ABI 7300",
                id: "abi_7300",
            },
            {
                name: "ABI 7500/ 7500FAST",
                id: "abi_7500_7500fast",
            },
            {
                name: "ABI StepOne/ StepOnePlus",
                id: "abi_stepone_steponeplus",
            },
            {
                name: "BioRad iQ5",
                id: "biorad_iq5",
            },
            {
                name: "BioRad CFX96",
                id: "biorad_cfx96",
            },
            {
                name: "Roche LC 2.0",
                id: "roche_lc_20",
            },
            {
                name: "Roche LC 480",
                id: "roche_lc_480",
            },
            {
                name: "Rotorgene 6000",
                id: "rotorgene_6000",
            },
            {
                name: "Rotorgene Q",
                id: "rotorgene_q",
            },
            {
                name: "Stratagene MX3005P",
                id: "stratagene_mx3005p",
            },
            {
                name: "Others: Please type in free text",
                id: "others",
            },
        ]
    }

    if (loading) return <div style={{ width: '100%', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className='alert alert-default-info py-1' style={{ borderRadius: '40px' }}>
            Loading...
        </div>
    </div>
    if (status && status.type && status.message) return <div style={{ width: '100%', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className={'alert alert-default-' + (status.type || 'default') + ' py-1'} style={{ borderRadius: '40px' }}>
            {status.message}
        </div>
        <div>
            <a className='btn btn-link' href='/participant-home'
            // onClick={ev => {
            //     ev.preventDefault()
            //     if (typeof window !== 'undefined') window.history.back()
            // }}
            >&larr; Go back</a>
            <a className='btn btn-link' href='/'> Go home</a>
        </div>
    </div>
    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-md-12'>
                    <div className='card'>
                        <div className='card-header'>
                            <h3 className='card-title'>Submission Form {data?.round_name || ""}</h3>
                        </div>
                        <div className='card-body'>
                            <div className='row'>
                                {(status && status.type && status.message) &&
                                    <div className={'alert alert-default-' + (status.type || 'default') + ' w-100 rounded'}>
                                        {status.message}
                                    </div>}
                            </div>
                            <div className='row'>
                                <form className='w-100' onSubmit={ev => {
                                    ev.preventDefault()

                                    // if (loading) return
                                    setLoading(true)
                                    const formData = new FormData(ev.target)
                                    const data = {}
                                    for (const [key, value] of formData.entries()) {
                                        data[key] = value
                                    }
                                    // console.log(data)

                                    let payload = {
                                        'pt_shipment_id': data['shipment_id'],
                                        'panel_receipt_date': data['panel_recpt_date'],
                                        'reporting_date': data['reporting_date'],
                                        'tested_by': data['tested_by'],
                                        'submitted_by': data['reported_by'],
                                        'result': data
                                    }

                                    SubmitPT(payload, data?.shipment_id, data?.form_submission_id == null ? "new" : "update", data?.form_submission_id).then(rspnse => {
                                        console.log(rspnse)
                                        if (rspnse.status == 200) {
                                            setStatus({ type: 'success', message: 'Submission successful. \n' + rspnse.message })
                                        } else {
                                            setStatus({ type: 'danger', message: 'Submission failed. \n' + rspnse.message })
                                        }
                                        setLoading(false)
                                    })

                                }}>
                                    <div className='row'>
                                        <div className='col-md-12'>

                                            <div role="tabpanel">
                                                <ul className="nav nav-tabs" role="tablist" id="tab_list">
                                                    <li role="presentation" className="nav-item active">
                                                        <a className="nav-link active" href="#primary_info" aria-controls="primary_info" role="tab" data-toggle="tab">Primary Information</a>
                                                    </li>
                                                    <li role="presentation" className="nav-item">
                                                        <a className="nav-link" href="#results" aria-controls="results" role="tab" data-toggle="tab">Results</a>
                                                    </li>
                                                    <li role="presentation" className="nav-item">
                                                        <a className="nav-link" href="#sample_prep" aria-controls="sample_prep" role="tab" data-toggle="tab">Sample Preparation</a>
                                                    </li>
                                                    <li role="presentation" className="nav-item">
                                                        <a className="nav-link" href="#detection_methods" aria-controls="detection_methods" role="tab" data-toggle="tab">Detection Methods</a>
                                                    </li>
                                                    <li role="presentation" className="nav-item">
                                                        <a className="nav-link" href="#molecular_detection" aria-controls="molecular_detection" role="tab" data-toggle="tab">Molecular Detection</a>
                                                    </li>
                                                </ul>

                                                <div className="tab-content">
                                                    <div role="tabpanel" className="tab-pane active" id="primary_info">
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <h4 className='mt-3 mb-2 text-center'>Test Instructions</h4>
                                                                <div className='alert alert-default-warning'>
                                                                    <p>{data?.test_instructions || ''}</p>
                                                                    {/* Hidden inputs */}
                                                                    <input type='hidden' name='form_submission_id' value={data?.form_submission_id || ''} />
                                                                    <input type='hidden' name='shipment_id' value={data?.pt_shipements_id || ''} />
                                                                    <input type='hidden' name='readiness_id' value={data?.readiness_id || ''} />
                                                                    <input type='hidden' name='readiness_approval_id' value={data?.readiness_approval_id || ''} />
                                                                    <input type='hidden' name='end_date' value={data?.end_date || ''} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <h3 className='mt-2 mb-1 text-center'>Primary Information</h3>
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label>Deadline</label><br style={{ lineHeight: '0' }} />
                                                                    <span className='well rounded form-control w-100' style={{ border: '1px solid #ced4da', cursor: 'not-allowed' }}>{formResults['submission_deadline_date'] || data?.end_date}</span>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label>Date of dispatch</label>
                                                                    <input type="date"
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        className="form-control" name="dispatch_date" defaultValue={formResults['dispatch_date'] || ''} />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label>Date of panel receipt</label>
                                                                    <input type="date"
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        className="form-control" name="panel_recpt_date" defaultValue={formResults['panel_recpt_date'] || ''} />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label>Reporting date</label>
                                                                    <input type="date"
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        className="form-control" name="reporting_date" defaultValue={formResults['reporting_date'] || new Date().toLocaleDateString().split('/').reverse().join('-')} />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label>Test performed by</label>
                                                                    <input type="text"
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        className="form-control" name="tested_by" defaultValue={formResults['tested_by'] || ''} placeholder='Tester Name' />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label>Results reported by</label>
                                                                    <input type="text"
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        className="form-control" name="reported_by" defaultValue={formResults['reported_by'] || ''} placeholder='Reporter Name' />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div role="tabpanel" className="tab-pane" id="results">
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <h3 className='mt-2 mb-1 text-center'>Results</h3>
                                                            </div>
                                                        </div>
                                                        <div className='row'>
                                                            <div className='table-responsive'>
                                                                <table className="table table-sm align-middle table-bordered">
                                                                    <thead className="text-center">
                                                                        <tr className="font-light">
                                                                            <th style={{ verticalAlign: 'middle' }} rowSpan={3}>&nbsp;&nbsp;SAMPLE&nbsp;&nbsp;</th>
                                                                            <th style={{ verticalAlign: 'middle' }} colSpan={
                                                                                methods.reduce((acc, curr) => acc + 3, 0)
                                                                            }>
                                                                                {/* METHODS */}
                                                                                Individual RT-PCR Results<br style={{ lineHeight: 0 }} />
                                                                                [Please fill in Ct values (for real-time PCR), POS/ NEG (for conventional PCR) or leave blank if not tested]
                                                                            </th>
                                                                            <th style={{ verticalAlign: 'middle' }} rowSpan={3}>INTERPRETATION</th>
                                                                            <th style={{ verticalAlign: 'middle' }} rowSpan={3}>REMARKS/NOTES</th>
                                                                        </tr>
                                                                        <tr className="font-light">
                                                                            {methods.map(method => (
                                                                                <th style={{ verticalAlign: 'middle' }} key={method.id} colSpan={3}>{method.name}</th>
                                                                            ))}
                                                                        </tr>
                                                                        <tr className="font-light">
                                                                            {methods.map((method, mx) => {
                                                                                return new Array(3).fill(0).map((z, i) => (
                                                                                    <th style={{ verticalAlign: 'middle' }} key={`${method.id}_${i}`}>
                                                                                        {/* Target {i + 1} */}
                                                                                        <select
                                                                                            onChange={(ev) => {
                                                                                                handleInputChange(ev)
                                                                                            }}
                                                                                            value={formResults['mthd_' + method.id + '_target_' + (i + 1) + '_gn_trgt'] || ''}
                                                                                            className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={'mthd_' + method.id + '_target_' + (i + 1) + '_gn_trgt'}>
                                                                                            <option value=''>Gene target {i + 1}</option>
                                                                                            {dataDictionary['gene_option']?.map((item, index) => (
                                                                                                <option key={item.id} value={item.name.trim()}>{item.name.trim()}</option>
                                                                                            ))}
                                                                                        </select>
                                                                                        {(formResults && formResults['mthd_' + method.id + '_target_' + (i + 1) + '_gn_trgt'] && formResults['mthd_' + method.id + '_target_' + (i + 1) + '_gn_trgt'] == dataDictionary['gene_option'].find(r => r.id == "other_gene_option").name) &&
                                                                                            <input type="text" onChange={(ev) => {
                                                                                                handleInputChange(ev)
                                                                                            }} className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={'mthd_' + method.id + '_target_' + (i + 1) + '_gn_trgt_other'} value={formResults['mthd_' + method.id + '_target_' + (i + 1) + '_gn_trgt_other']} />}
                                                                                    </th>
                                                                                ))
                                                                            })}
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {samples.map(sample => (
                                                                            <tr key={sample.id}>
                                                                                <td style={{ verticalAlign: 'middle', fontSize: '0.85em' }}>{sample.name}</td>
                                                                                {methods.map(method => {
                                                                                    return new Array(3).fill(0).map((z, i) => (
                                                                                        <td key={`${sample.id}_${method.id}_${i}`} style={{ verticalAlign: 'middle' }}>
                                                                                            <input value={formResults[`smpl_${sample.id}_mthd_${method.id}_trgt_${i + 1}_result`] || ''} onChange={(ev) => {
                                                                                                handleInputChange(ev)
                                                                                            }} type="text" className="form-control" style={{ height: 'auto', padding: '1px 2px' }} name={`smpl_${sample.id}_mthd_${method.id}_trgt_${i + 1}_result`} />
                                                                                        </td>
                                                                                    ))
                                                                                })}
                                                                                <td style={{ verticalAlign: 'middle' }}>
                                                                                    <select value={formResults[`smpl_${sample.id}_interpretation`] || ''} className="form-control" style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={`smpl_${sample.id}_interpretation`} onChange={(ev) => {
                                                                                        handleInputChange(ev)
                                                                                    }}>
                                                                                        <option value=''>Select</option>
                                                                                        {dataDictionary['interpretation_options']?.map((item, index) => (
                                                                                            <option key={item.id} value={item.name.trim()}>{item.name.trim()}</option>
                                                                                        ))}
                                                                                    </select>
                                                                                    {(formResults && formResults[`smpl_${sample.id}_interpretation`] && formResults[`smpl_${sample.id}_interpretation`] == dataDictionary['interpretation_options'].find(r => r.id == "others").name) &&
                                                                                            <input type="text" onChange={(ev) => {
                                                                                                handleInputChange(ev)
                                                                                            }} className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={`smpl_${sample.id}_interpretation_other`} value={formResults[`smpl_${sample.id}_interpretation_other`]} />}
                                                                                </td>
                                                                                <td style={{ verticalAlign: 'middle' }}>
                                                                                    <textarea rows={1} onInput={(ev) => {
                                                                                        handleInputChange(ev)
                                                                                    }} className="form-control" value={formResults[`smpl_${sample.id}_remarks`]} style={{ height: 'auto', padding: '1px 2px' }} name={`smpl_${sample.id}_remarks`} />
                                                                                    <textarea rows={1} onChange={(ev) => {
                                                                                        handleInputChange(ev)
                                                                                    }} className="form-control" value={formResults[`smpl_${sample.id}_remarks`]} style={{ height: 'auto', padding: '1px 2px' }} name={`smpl_${sample.id}_remarks`} />
                                                                                </td>
                                                                            </tr>)
                                                                        )}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div role="tabpanel" className="tab-pane" id="sample_prep">
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <h3 className='mt-2 mb-1 text-center'>Sample Preparation</h3>
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>Heat inactivation of samples?</label>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                                                                        <span style={{ display: 'flex', alignItems: 'center' }}>
                                                                            <input onChange={(ev) => {
                                                                                handleInputChange(ev)
                                                                            }} type="radio" value={true} name="heat_sample_inactivation" checked={formResults['heat_sample_inactivation'] == 'true' || formResults['heat_sample_inactivation'] == true} style={{ width: '16px', height: '16px' }} />
                                                                            <span className='ml-1'>Yes</span>
                                                                        </span>
                                                                        &nbsp; &nbsp;
                                                                        <span style={{ display: 'flex', alignItems: 'center' }}>
                                                                            <input onChange={(ev) => {
                                                                                handleInputChange(ev)
                                                                            }} type="radio" value={false} name="heat_sample_inactivation" checked={formResults['heat_sample_inactivation'] == 'false' || formResults['heat_sample_inactivation'] == false} style={{ width: '16px', height: '16px' }} />
                                                                            <span className='ml-1'>No</span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {(formResults && formResults['heat_sample_inactivation'] && formResults['heat_sample_inactivation'] == 'true') && <><div className="col-md-4">
                                                                <div className="form-group">
                                                                    <label>Temperature</label>
                                                                    <input type="number" onChange={(ev) => {
                                                                        handleInputChange(ev)
                                                                    }} className="form-control" name="inactivation_temp" value={formResults['inactivation_temp'] || ''} placeholder='0' />
                                                                </div>
                                                            </div>
                                                                <div className="col-md-4">
                                                                    <div className="form-group">
                                                                        <label>Duration (minutes)</label>
                                                                        <input type="number" onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }} className="form-control" name="inactivation_duration" value={formResults['inactivation_duration'] || ''} placeholder='0' />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <div className="form-group">
                                                                        <label>Method</label>
                                                                        <select
                                                                            onChange={(ev) => {
                                                                                handleInputChange(ev)
                                                                            }}
                                                                            value={formResults['heat)inactivation_method'] || ''}
                                                                            className='form-control' name='heat_inactivation_method'>
                                                                            <option value=''>Select</option>
                                                                            {dataDictionary?.heat_inactivation_method_options?.map((item, index) => (
                                                                                <option key={item.id} value={item.name.trim()}>{item.name.trim()}</option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                </div></>}
                                                        </div>
                                                    </div>
                                                    <div role="tabpanel" className="tab-pane" id="detection_methods">
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <h3 className='mt-2 mb-1 text-center'>Detection Methods</h3>
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <div className="table-responsive">
                                                                    <table className="table table-bordered table-striped table-sm">
                                                                        <thead>
                                                                            <tr>
                                                                                <th style={{ verticalAlign: 'middle', maxWidth: '220px' }}>Method | Target gene(s)</th>
                                                                                <th style={{ verticalAlign: 'middle' }}>Conventional / Real-time</th>
                                                                                <th style={{ verticalAlign: 'middle' }}>In-house / Commercial</th>
                                                                                <th style={{ verticalAlign: 'middle' }}>Assay</th>
                                                                                <th style={{ verticalAlign: 'middle' }}>Algorithm</th>
                                                                                <th style={{ verticalAlign: 'middle' }}>Machine brand / model name</th>
                                                                                <th style={{ verticalAlign: 'middle' }}>Remarks</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {/* <td colSpan={7} className='text-center'>No data available</td> */}
                                                                            {methods.map((method, mx) => {
                                                                                return <tr key={mx}>
                                                                                    <td style={{ verticalAlign: 'middle', display: 'flex', flexDirection: 'column', padding: '3px 0px' }}>
                                                                                        <small style={{ textAlign: 'center', margin: '3px 0', padding: '4px', borderTop: '1px solid #ccb', fontWeight: 'bold', backgroundColor: 'wheat' }}>{method.name}</small>
                                                                                        {new Array(3).fill(0).map((z, i) => (
                                                                                            <small style={{ textAlign: 'center', margin: '2px 0', padding: '4px', borderBottom: '1px solid #ccb' }} key={"dm_" + mx + "_spl_" + i}>{formResults['mthd_' + method.id + '_target_' + (i + 1) + '_gn_trgt'] || "Gene target " + (i + 1)}</small>
                                                                                        ))}
                                                                                    </td>
                                                                                    <td style={{ verticalAlign: 'middle' }}>
                                                                                        <select onChange={(ev) => {
                                                                                            handleInputChange(ev)
                                                                                        }} className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={`detection_method_${mx + 1}_conventional_realtime`} value={formResults[`detection_method_${mx + 1}_conventional_realtime`] || ''}>
                                                                                            <option value=''>Select</option>
                                                                                            {dataDictionary['conventional_real-time-options']?.map((item, index) => (
                                                                                                <option key={item.id} value={item.name.trim()}>{item.name.trim()}</option>
                                                                                            ))}
                                                                                        </select>
                                                                                    </td>
                                                                                    <td style={{ verticalAlign: 'middle' }}>
                                                                                        <select onChange={(ev) => {
                                                                                            handleInputChange(ev)
                                                                                        }} className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={`detection_method_${mx + 1}_inhouse_commercial`} value={formResults[`detection_method_${mx + 1}_inhouse_commercial`] || ''}>
                                                                                            <option value=''>Select</option>
                                                                                            {dataDictionary['in-house_commercial-options']?.map((item, index) => (
                                                                                                <option key={item.id} value={item.name.trim()}>{item.name.trim()}</option>
                                                                                            ))}
                                                                                        </select>
                                                                                    </td>
                                                                                    <td style={{ verticalAlign: 'middle' }}>
                                                                                        <select onChange={(ev) => {
                                                                                            handleInputChange(ev)
                                                                                        }} className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em', maxWidth: '320px' }} name={`detection_method_${(mx + 1)}_assay_1`} value={formResults[`detection_method_${(mx + 1)}_assay_1`] || ''}>
                                                                                            <option value=''>Select</option>
                                                                                            {dataDictionary['assay-options']?.map((item, index) => (
                                                                                                <option key={item.id} value={item.name.trim()}>{item.name.trim()}</option>
                                                                                            ))}
                                                                                        </select>
                                                                                        <br />
                                                                                        <select onChange={(ev) => {
                                                                                            handleInputChange(ev)
                                                                                        }} className='form-control autocomplete' id="assay_2_dropdown" data-live-search="true" style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em', maxWidth: '320px' }} name={`detection_method_${(mx + 1)}_assay_2`} value={formResults[`detection_method_${(mx + 1)}_assay_2`] || ''}>
                                                                                            <option value=''>Select</option>
                                                                                            {dataDictionary['assay-options-2']?.map((item, index) => (
                                                                                                <option key={item.id} value={item.name.trim()}>{item.name.trim()}</option>
                                                                                            ))}
                                                                                        </select>
                                                                                    </td>
                                                                                    <td style={{ verticalAlign: 'middle' }}>
                                                                                        <select onChange={(ev) => {
                                                                                            handleInputChange(ev)
                                                                                        }} className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={`detection_method_${mx + 1}_algorithm`} value={formResults[`detection_method_${mx + 1}_algorithm`] || ''}>
                                                                                            <option value=''>Select</option>
                                                                                            {dataDictionary['algorithm_options']?.map((item, index) => (
                                                                                                <option key={item.id} value={item.name.trim()}>{item.name.trim()}</option>
                                                                                            ))}
                                                                                        </select>
                                                                                        {(formResults && formResults[`detection_method_${mx + 1}_algorithm`] && formResults[`detection_method_${mx + 1}_algorithm`] == dataDictionary['algorithm_options'].find(r => r.id == "others").name) &&
                                                                                            <input type="text" onChange={(ev) => {
                                                                                                handleInputChange(ev)
                                                                                            }} className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={`detection_method_${mx + 1}_algorithm_other`} value={formResults[`detection_method_${mx + 1}_algorithm_other`] || ''} />}
                                                                                    </td>
                                                                                    <td style={{ verticalAlign: 'middle' }}>
                                                                                        <select onChange={(ev) => {
                                                                                            handleInputChange(ev)
                                                                                        }} className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={`detection_method_${mx + 1}_machine_brand`} value={formResults[`detection_method_${mx + 1}_machine_brand`] || ''}>
                                                                                            <option value=''>Select</option>
                                                                                            {dataDictionary['brand_options']?.map((item, index) => (
                                                                                                <option key={item.id} value={item.name.trim()}>{item.name.trim()}</option>
                                                                                            ))}
                                                                                        </select>
                                                                                        {(formResults && formResults[`detection_method_${mx + 1}_machine_brand`] && formResults[`detection_method_${mx + 1}_machine_brand`] == dataDictionary['brand_options'].find(r => r.id == "others").name) &&
                                                                                            <input type="text" onChange={(ev) => {
                                                                                                handleInputChange(ev)
                                                                                            }} className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={`detection_method_${mx + 1}_machine_brand_other`} value={formResults[`detection_method_${mx + 1}_machine_brand_other`] || ''} />}
                                                                                    </td>
                                                                                    <td style={{ verticalAlign: 'middle' }}>
                                                                                        <textarea onChange={(ev) => {
                                                                                            handleInputChange(ev)
                                                                                        }} className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={`detection_method_${mx + 1}_remarks`} value={formResults[`detection_method_${mx + 1}_remarks`]} rows={3}></textarea>
                                                                                    </td>
                                                                                </tr>
                                                                            })}
                                                                            <tr>
                                                                                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                                                                                    <small>Remarks</small>
                                                                                </td>
                                                                                <td colSpan={6} className='text-center'>
                                                                                    <textarea onChange={(ev) => {
                                                                                        handleInputChange(ev)
                                                                                    }} className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={`detection_method_overall_remarks`} value={formResults[`detection_method_overall_remarks`] || ''} rows={3}></textarea>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div role="tabpanel" className="tab-pane" id="molecular_detection">
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <h3 className='mt-2 mb-1 text-center'>Implementation of Molecular Detection (Questionnaire)</h3>
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>(a) Major concern(s) in launching/ implementing the molecular detection of SARS-CoV-2?</label>
                                                                    <select
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['concerns_molecular_detection_launch'] || ''}
                                                                        className='form-control' name='concerns_molecular_detection_launch'>
                                                                        <option value=''>Select</option>
                                                                        {dataDictionary['molecularconcerns-options']?.map((item, index) => (
                                                                            <option key={item.id} value={item.name.trim()}>{item.name.trim()}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>Additional comments/remarks?</label>
                                                                    <textarea
                                                                        onInput={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['concerns_molecular_detection_launch_remarks'] || ''}
                                                                        className='form-control' name='concerns_molecular_detection_launch_remarks' rows={3}></textarea>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>(b) What are the sources of the specimens for testing in your laboratory?</label>
                                                                    <select
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['specimen_sources'] || ''}
                                                                        className='form-control' name='specimen_sources'>
                                                                        <option value=''>Select</option>
                                                                        {dataDictionary['specimen_sources-options']?.map((item, index) => (
                                                                            <option key={item.id} value={item.name.trim()}>{item.name.trim()}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>Additional comments/remarks?</label>
                                                                    <textarea
                                                                        onInput={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['specimen_sources_remarks'] || ''}
                                                                        className='form-control' name='specimen_sources_remarks' rows={3}></textarea>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>(c) Are you testing all specimens coming in?</label>
                                                                    <select
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['testing_all_specimens'] || ''}
                                                                        className='form-control' name='testing_all_specimens'>
                                                                        <option value=''>Select</option>
                                                                        {dataDictionary['yes_no_options']?.map((item, index) => (
                                                                            <option key={item.id} value={item.name.trim()}>{item.name.trim()}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>(c) If No, what is the criteria of prioritization of specimens for testing?</label>
                                                                    <textarea
                                                                        onInput={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['specimen_testing_criteria'] || ''}
                                                                        className='form-control' name='specimen_testing_criteria' rows={2}></textarea>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>Additional comments/remarks?</label>
                                                                    <textarea
                                                                        onInput={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['testing_all_specimens_criteria_remarks'] || ''}
                                                                        className='form-control' name='testing_all_specimens_criteria_remarks' rows={3}></textarea>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>(d) What are the common type of specimens accepted for the molecular detection of SARS-CoV-2 in your laboratory?</label>
                                                                    <select
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['common_specimen_options'] || ''}
                                                                        className='form-control' name='common_specimen_options'>
                                                                        <option value=''>Select</option>
                                                                        {dataDictionary['common-specimen-options']?.map((item, index) => (
                                                                            <option key={item.id} value={item.name.trim()}>{item.name.trim()}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>Additional comments/remarks?</label>
                                                                    <textarea
                                                                        onInput={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['common_specimen_options_remarks'] || ''}
                                                                        className='form-control' name='common_specimen_options_remarks' rows={3}></textarea>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>(e) What is the usual daily sample load/ current maximum daily testing capacity for SARS-CoV-2 in your laboratory?</label>
                                                                    <div className='row px-3'>
                                                                        <div className='col-md-5'>
                                                                            <label>Daily sample load</label>
                                                                            <select
                                                                                onChange={(ev) => {
                                                                                    handleInputChange(ev)
                                                                                }}
                                                                                value={formResults['daily_sample_load'] || ''}
                                                                                className='form-control' name='daily_sample_load'>
                                                                                <option value=''>Select</option>
                                                                                {dataDictionary['daily-sample-load-options']?.map((item, index) => (
                                                                                    <option key={item.id} value={item.name.trim()}>{item.name.trim()}</option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                        <div className='col-md-5'>
                                                                            <label>Maximum daily testing capacity</label>
                                                                            <select
                                                                                onChange={(ev) => {
                                                                                    handleInputChange(ev)
                                                                                }}
                                                                                value={formResults['maximum_daily_capacity'] || ''}
                                                                                className='form-control' name='maximum_daily_capacity'>
                                                                                <option value=''>Select</option>
                                                                                {dataDictionary['daily-sample-load-options']?.map((item, index) => (
                                                                                    <option key={item.id} value={item.name.trim()}>{item.name.trim()}</option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>Additional comments/remarks?</label>
                                                                    <textarea
                                                                        onInput={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['sample_load_test_capacity_remarks'] || ''}
                                                                        className='form-control' name='sample_load_test_capacity_remarks' rows={3}></textarea>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>(f) What is the usual turnaround time for the molecular detection of SARS-CoV-2 in your laboratory?</label>
                                                                    <select
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['turnaround_time'] || ''}
                                                                        className='form-control' name='turnaround_time'>
                                                                        <option value=''>Select</option>
                                                                        {dataDictionary['tat-options']?.map((item, index) => (
                                                                            <option key={item.id} value={item.name.trim()}>{item.name.trim()}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>Additional comments/remarks?</label>
                                                                    <textarea
                                                                        onInput={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['turnaround_time_remarks'] || ''}
                                                                        className='form-control' name='turnaround_time_remarks' rows={3}></textarea>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>(g) BSL requirement if any in your country?</label>
                                                                    <div className='row px-3'>
                                                                        <div className='col-md-5'>
                                                                            <label>For PCR</label>
                                                                            <select
                                                                                onChange={(ev) => {
                                                                                    handleInputChange(ev)
                                                                                }}
                                                                                value={formResults['bsl_pcr'] || ''}
                                                                                className='form-control' name='bsl_pcr'>
                                                                                <option value=''>Select</option>
                                                                                {dataDictionary['bsl-pcr-options']?.map((item, index) => (
                                                                                    <option key={item.id} value={item.name.trim()}>{item.name.trim()}</option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                        <div className='col-md-5'>
                                                                            <label>For virus isolation</label>
                                                                            <select
                                                                                onChange={(ev) => {
                                                                                    handleInputChange(ev)
                                                                                }}
                                                                                value={formResults['bsl_virus_isolation'] || ''}
                                                                                className='form-control' name='bsl_virus_isolation'>
                                                                                <option value=''>Select</option>
                                                                                {dataDictionary['bsl-pcr-options']?.map((item, index) => (
                                                                                    <option key={item.id} value={item.name.trim()}>{item.name.trim()}</option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>Additional comments/remarks?</label>
                                                                    <textarea
                                                                        onInput={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['bsl_requirements_remarks'] || ''}
                                                                        className='form-control' name='bsl_requirements_remarks' rows={3}></textarea>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>(h) Which type(s) of quality control(s) is/are included in the molecular detection of SARS-CoV-2 in your laboratory?</label>
                                                                    <select
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['quality_ctrl'] || ''}
                                                                        className='form-control' name='quality_ctrl'>
                                                                        <option value=''>Select</option>
                                                                        {dataDictionary['qc-options']?.map((item, index) => (
                                                                            <option key={item.id} value={item.name.trim()}>{item.name.trim()}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>Additional comments/remarks?</label>
                                                                    <textarea
                                                                        onInput={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['quality_ctrl_remarks'] || ''}
                                                                        className='form-control' name='quality_ctrl_remarks' rows={3}></textarea>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>(h) Has the detection method(s) been validated against other common respiratory pathogens?</label>
                                                                    <select
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['method_validation'] || ''}
                                                                        className='form-control' name='method_validation'>
                                                                        <option value=''>Select</option>
                                                                        {dataDictionary['respiratory-options']?.map((item, index) => (
                                                                            <option key={item.id} value={item.name.trim()}>{item.name.trim()}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>Additional comments/remarks?</label>
                                                                    <textarea
                                                                        onInput={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['method_validation_remarks'] || ''}
                                                                        className='form-control' name='method_validation_remarks' rows={3}></textarea>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <button type="submit" className="btn btn-primary"> &nbsp; Submit &nbsp; </button>
                                                                <button type="reset" className="btn btn-link float-right">Reset</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {/* {(typeof window !== 'undefined' && ["localhost", "127.0.0.1"].includes(window.location.hostname)) && <div className='col-md-12 p-2 rounded text-sm text-muted' style={{ backgroundColor: '#f5fafb' }}>
                    <small>
                        <details open>
                            <summary>Data</summary>
                            <pre style={{ whiteSpace: 'pre-wrap' }} className="text-muted">{JSON.stringify(data, null, 2)}</pre>
                        </details>
                        <details>
                            <summary>FormResults</summary>
                            <pre style={{ whiteSpace: 'pre-wrap' }} className="text-muted">{JSON.stringify(formResults, null, 2)}</pre>
                        </details>
                    </small>
                </div>} */}
            </div>
        </div >
    )
}

export default SubmissionForm

if (document.getElementById('submission_form')) {
    ReactDOM.render(<SubmissionForm />, document.getElementById('submission_form'));
}