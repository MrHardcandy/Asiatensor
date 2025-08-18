#!/usr/bin/env python3
"""
Asiatensor Language Files Consistency Analysis
==============================================

This script performs a comprehensive consistency check on the five language files:
- English (en.json)
- Japanese (ja.json) 
- Korean (ko.json)
- Simplified Chinese (zh-cn.json)
- Traditional Chinese (zh-hk.json)

Analysis includes:
1. Structure consistency
2. Key completeness
3. Numerical values consistency
4. Financial projections accuracy
5. Content completeness assessment
"""

import json
import os
from typing import Dict, List, Tuple, Any
from collections import defaultdict
import re

class LanguageConsistencyAnalyzer:
    def __init__(self, base_path: str):
        self.base_path = base_path
        self.languages = {
            'en': 'English',
            'ja': 'Japanese', 
            'ko': 'Korean',
            'zh-cn': 'Simplified Chinese',
            'zh-hk': 'Traditional Chinese'
        }
        self.data = {}
        self.load_all_files()
    
    def load_all_files(self):
        """Load all language files"""
        for lang_code in self.languages.keys():
            file_path = os.path.join(self.base_path, f"assets/locales/{lang_code}.json")
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    self.data[lang_code] = json.load(f)
                print(f"✓ Loaded {self.languages[lang_code]} ({lang_code}.json)")
            except Exception as e:
                print(f"✗ Error loading {lang_code}.json: {e}")
                self.data[lang_code] = {}
    
    def extract_keys_recursive(self, obj: Dict, prefix: str = "") -> List[str]:
        """Recursively extract all keys from a nested dictionary"""
        keys = []
        for key, value in obj.items():
            current_key = f"{prefix}.{key}" if prefix else key
            keys.append(current_key)
            if isinstance(value, dict):
                keys.extend(self.extract_keys_recursive(value, current_key))
        return keys
    
    def check_structure_consistency(self) -> Dict[str, List[str]]:
        """Check if all files have the same structure (keys)"""
        print("\n" + "="*60)
        print("1. STRUCTURE CONSISTENCY ANALYSIS")
        print("="*60)
        
        all_keys = {}
        for lang, data in self.data.items():
            all_keys[lang] = set(self.extract_keys_recursive(data))
        
        # Find common keys and missing keys
        if all_keys:
            reference_keys = all_keys['en']  # Use English as reference
            issues = {}
            
            for lang, keys in all_keys.items():
                missing = reference_keys - keys
                extra = keys - reference_keys
                
                if missing or extra:
                    issues[lang] = {
                        'missing': list(missing),
                        'extra': list(extra)
                    }
            
            if issues:
                print("⚠️  STRUCTURE INCONSISTENCIES FOUND:")
                for lang, problems in issues.items():
                    print(f"\n{self.languages[lang]} ({lang}):")
                    if problems['missing']:
                        print(f"  Missing keys: {problems['missing']}")
                    if problems['extra']:
                        print(f"  Extra keys: {problems['extra']}")
            else:
                print("✓ All files have consistent structure")
        
        return issues if 'issues' in locals() else {}
    
    def extract_numbers(self, text: str) -> List[str]:
        """Extract numbers, amounts, and percentages from text"""
        if not isinstance(text, str):
            return []
        
        # Pattern to match various number formats
        patterns = [
            r'\$[\d,]+(?:\.\d+)?[A-Za-z]*',  # Dollar amounts like $20M, $2.79
            r'[\d,]+(?:\.\d+)?%',             # Percentages like 200%, 18%
            r'[\d,]+(?:\.\d+)?\s*(?:万|萬|만|M|億|억|千|K)',  # Asian number units
            r'[\d,]+(?:\.\d+)?',              # Regular numbers
            r'[０-９]+',                      # Full-width numbers
            r'[0-9]+',                        # Half-width numbers
        ]
        
        numbers = []
        for pattern in patterns:
            numbers.extend(re.findall(pattern, text))
        
        return numbers
    
    def check_numerical_consistency(self):
        """Check consistency of numerical values across languages"""
        print("\n" + "="*60)
        print("2. NUMERICAL VALUES CONSISTENCY ANALYSIS")
        print("="*60)
        
        # Key financial figures to check
        key_financial_keys = [
            'executive_summary.total_funding',
            'executive_summary.round1_funding', 
            'executive_summary.target_market_cap',
            'executive_summary.projected_annual_profit',
            'executive_summary.projected_daily_volume',
            'chapter5.section5_2.initial_tao',
            'chapter5.section5_2.annual_output',
            'chapter6.section6_1.total_funding',
            'chapter6.section6_1.round1_funding'
        ]
        
        issues = []
        
        def get_nested_value(obj, key_path):
            """Get value from nested dictionary using dot notation"""
            keys = key_path.split('.')
            current = obj
            for key in keys:
                if isinstance(current, dict) and key in current:
                    current = current[key]
                else:
                    return None
            return current
        
        for key_path in key_financial_keys:
            values = {}
            for lang, data in self.data.items():
                value = get_nested_value(data, key_path)
                if value:
                    numbers = self.extract_numbers(str(value))
                    values[lang] = {
                        'raw': value,
                        'numbers': numbers
                    }
            
            if values:
                # Check if extracted numbers are consistent
                all_numbers = [v['numbers'] for v in values.values()]
                if not all(nums == all_numbers[0] for nums in all_numbers):
                    issues.append({
                        'key': key_path,
                        'values': values
                    })
        
        if issues:
            print("⚠️  NUMERICAL INCONSISTENCIES FOUND:")
            for issue in issues:
                print(f"\nKey: {issue['key']}")
                for lang, data in issue['values'].items():
                    print(f"  {self.languages[lang]}: {data['raw']}")
                    print(f"    Numbers: {data['numbers']}")
        else:
            print("✓ All numerical values appear consistent")
    
    def check_content_completeness(self):
        """Check content completeness and identify missing translations"""
        print("\n" + "="*60)
        print("3. CONTENT COMPLETENESS ANALYSIS")
        print("="*60)
        
        def count_content_recursive(obj, prefix=""):
            """Count content items recursively"""
            count = 0
            empty_keys = []
            
            if isinstance(obj, dict):
                for key, value in obj.items():
                    current_key = f"{prefix}.{key}" if prefix else key
                    if isinstance(value, dict):
                        sub_count, sub_empty = count_content_recursive(value, current_key)
                        count += sub_count
                        empty_keys.extend(sub_empty)
                    elif isinstance(value, str):
                        if value.strip():
                            count += 1
                        else:
                            empty_keys.append(current_key)
                    else:
                        count += 1
            
            return count, empty_keys
        
        completeness = {}
        for lang, data in self.data.items():
            content_count, empty_keys = count_content_recursive(data)
            completeness[lang] = {
                'count': content_count,
                'empty_keys': empty_keys,
                'total_keys': len(self.extract_keys_recursive(data))
            }
        
        print("Content Statistics:")
        for lang, stats in completeness.items():
            completion_rate = (stats['count'] / stats['total_keys'] * 100) if stats['total_keys'] > 0 else 0
            print(f"{self.languages[lang]:20} | Content Items: {stats['count']:3} | Completion: {completion_rate:.1f}%")
            
            if stats['empty_keys']:
                print(f"  Empty content keys: {stats['empty_keys'][:5]}{'...' if len(stats['empty_keys']) > 5 else ''}")
    
    def check_appendix_consistency(self):
        """Check appendix content consistency (DATCOs report)"""
        print("\n" + "="*60)
        print("4. APPENDIX CONTENT ANALYSIS")
        print("="*60)
        
        # Check if appendix exists and has detailed content
        appendix_status = {}
        
        for lang, data in self.data.items():
            has_appendix = 'appendix' in data
            has_datco_report = False
            datco_content_count = 0
            
            if has_appendix and isinstance(data['appendix'], dict):
                if 'datco_report' in data['appendix']:
                    has_datco_report = True
                    # Count chapters in DATCO report
                    datco_report = data['appendix']['datco_report']
                    if isinstance(datco_report, dict):
                        datco_content_count = len([k for k in datco_report.keys() if k.startswith('chapter')])
            
            appendix_status[lang] = {
                'has_appendix': has_appendix,
                'has_datco_report': has_datco_report, 
                'datco_chapters': datco_content_count
            }
        
        print("Appendix Status:")
        for lang, status in appendix_status.items():
            print(f"{self.languages[lang]:20} | Appendix: {status['has_appendix']} | DATCO Report: {status['has_datco_report']} | Chapters: {status['datco_chapters']}")
        
        # Check consistency
        reference = appendix_status['en']
        inconsistent = []
        for lang, status in appendix_status.items():
            if (status['has_datco_report'] != reference['has_datco_report'] or 
                status['datco_chapters'] != reference['datco_chapters']):
                inconsistent.append(lang)
        
        if inconsistent:
            print(f"\n⚠️  Inconsistent appendix content in: {[self.languages[lang] for lang in inconsistent]}")
        else:
            print("\n✓ Appendix content is consistent across languages")
    
    def analyze_terminology_consistency(self):
        """Analyze key terminology consistency"""
        print("\n" + "="*60)
        print("5. KEY TERMINOLOGY ANALYSIS")
        print("="*60)
        
        # Key terms to check for consistency
        key_terms = {
            'Bittensor': ['Bittensor'],
            'TAO': ['TAO'],
            'Subnet': ['Subnet', 'サブネット', '서브넷', '子网', '子網'],
            'Validator': ['Validator', 'バリデーター', '검증자', '验证者', '驗證者'],
            'DATCO': ['DATCO'],
            'Asiatensor': ['Asiatensor', 'アジアテンサー', '아시아텐서']
        }
        
        print("Key Terminology Usage:")
        for term, expected_variants in key_terms.items():
            print(f"\n{term}:")
            for lang, data in self.data.items():
                content_str = json.dumps(data, ensure_ascii=False)
                found_variants = []
                for variant in expected_variants:
                    if variant in content_str:
                        count = content_str.count(variant)
                        found_variants.append(f"{variant}({count})")
                
                print(f"  {self.languages[lang]:15}: {', '.join(found_variants) if found_variants else 'Not found'}")
    
    def generate_summary_report(self):
        """Generate comprehensive summary report"""
        print("\n" + "="*80)
        print("COMPREHENSIVE ANALYSIS SUMMARY")
        print("="*80)
        
        # File size comparison
        print("\nFile Sizes:")
        for lang in self.languages.keys():
            file_path = os.path.join(self.base_path, f"assets/locales/{lang}.json")
            if os.path.exists(file_path):
                size = os.path.getsize(file_path)
                print(f"{self.languages[lang]:20} | {size:,} bytes")
        
        # Content depth analysis
        print("\nContent Depth Analysis:")
        for lang, data in self.data.items():
            max_depth = self.get_max_depth(data)
            total_keys = len(self.extract_keys_recursive(data))
            print(f"{self.languages[lang]:20} | Max Depth: {max_depth} | Total Keys: {total_keys}")
    
    def get_max_depth(self, obj: Dict, current_depth: int = 0) -> int:
        """Get maximum nesting depth of dictionary"""
        if not isinstance(obj, dict):
            return current_depth
        
        max_depth = current_depth
        for value in obj.values():
            if isinstance(value, dict):
                depth = self.get_max_depth(value, current_depth + 1)
                max_depth = max(max_depth, depth)
        
        return max_depth
    
    def run_full_analysis(self):
        """Run complete consistency analysis"""
        print("ASIATENSOR LANGUAGE FILES CONSISTENCY ANALYSIS")
        print("=" * 80)
        print(f"Analyzing {len(self.languages)} language files...")
        
        # Run all checks
        self.check_structure_consistency()
        self.check_numerical_consistency()
        self.check_content_completeness()
        self.check_appendix_consistency()
        self.analyze_terminology_consistency()
        self.generate_summary_report()
        
        print("\n" + "="*80)
        print("ANALYSIS COMPLETE")
        print("="*80)
        print("\nRecommendations:")
        print("1. Ensure all numerical values are consistent across languages")
        print("2. Complete any missing translations or content")
        print("3. Standardize terminology usage across all files")
        print("4. Maintain structural consistency when adding new content")
        print("5. Regular automated consistency checks before deployment")

def main():
    base_path = "/Users/mrhardcandy/Asiatensor"
    analyzer = LanguageConsistencyAnalyzer(base_path)
    analyzer.run_full_analysis()

if __name__ == "__main__":
    main()