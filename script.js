document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // HERO PARTICLES (Soft Particles) - PRESERVED
    // =========================================
    function createParticles() {
        const container = document.querySelector('.hero-bg-animation');
        if (!container) return;

        const particleCount = 30;
        const colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)'];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random positioning and sizing
            const size = Math.random() * 6 + 2; // 2px to 8px
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Random animation params
            particle.style.animationDuration = `${Math.random() * 10 + 10}s`; // 10-20s
            particle.style.animationDelay = `${Math.random() * 10}s`;
            
            container.appendChild(particle);
        }
    }
    createParticles();

    // =========================================
    // MOBILE NAVIGATION - PRESERVED
    // =========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('header nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking links
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // =========================================
    // SCROLL ANIMATIONS - PRESERVED
    // =========================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right').forEach(el => {
        observer.observe(el);
    });

    // =========================================
    // FAQ ACCORDION - PRESERVED
    // =========================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        btn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all others
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });
            
            // Toggle current
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // =========================================
    // MODALS (Privacy/Terms) - PRESERVED
    // =========================================
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = trigger.getAttribute('data-modal-target');
            const modal = document.getElementById(targetId);
            if (modal) {
                modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden'; // Prevent body scroll
            }
        });
    });
    
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        });
    });
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });
    });

    // =========================================
    // BACKEND INTEGRATION
    // =========================================

    // Global State
    let currentUploadedUrl = null;
    const USER_ID = 'DObRu1vyStbUynoQmTcHBlhs55z2';
    
    // DOM Elements for Logic
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');
    const previewImage = document.getElementById('preview-image');
    const removeImgBtn = document.getElementById('remove-img-btn');
    const uploadContent = document.querySelector('.upload-content');
    const generateBtn = document.getElementById('generate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const downloadBtn = document.getElementById('download-btn');
    const resultImage = document.getElementById('result-final');
    const loadingState = document.getElementById('loading-state');
    const placeholderText = document.getElementById('placeholder-text');

    // --- UTILITY FUNCTIONS ---

    function generateNanoId(length = 21) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // --- UI HELPERS ---

    function showLoading() {
        if (loadingState) loadingState.classList.remove('hidden');
        if (placeholderText) placeholderText.classList.add('hidden');
        if (resultImage) resultImage.classList.add('hidden');
        
        // Disable buttons
        if (generateBtn) generateBtn.disabled = true;
        if (resetBtn) resetBtn.disabled = true;
    }

    function hideLoading() {
        if (loadingState) loadingState.classList.add('hidden');
        
        // Re-enable buttons
        if (generateBtn) generateBtn.disabled = false;
        if (resetBtn) resetBtn.disabled = false;
    }

    function updateStatus(text) {
        // Since original UI doesn't have a status text element, we update the Generate button text
        // or inject a status if needed. For now, we update the button.
        if (generateBtn) {
            if (text === 'READY') {
                generateBtn.textContent = 'Remove Mustache';
                generateBtn.disabled = false;
            } else if (text === 'COMPLETE') {
                generateBtn.textContent = 'Remove Mustache';
                generateBtn.disabled = false;
            } else {
                generateBtn.textContent = text; // "UPLOADING...", "PROCESSING..."
                generateBtn.disabled = true;
            }
        }
    }

    function showError(msg) {
        alert('Error: ' + msg);
        updateStatus('READY');
    }

    function showPreview(url) {
        if (previewImage) {
            previewImage.src = url;
            previewImage.classList.remove('hidden');
        }
        if (uploadContent) uploadContent.classList.add('hidden');
        if (removeImgBtn) removeImgBtn.classList.remove('hidden');
        if (resetBtn) resetBtn.disabled = false;
    }

    function showResultMedia(url) {
        if (resultImage) {
            resultImage.src = url;
            resultImage.classList.remove('hidden');
            // Force browser to fetch fresh if needed
            resultImage.src = url + '?t=' + new Date().getTime();
        }
        if (placeholderText) placeholderText.classList.add('hidden');
        
        // Scroll to result on mobile
        const resultContainer = document.getElementById('result-container');
        if (window.innerWidth < 768 && resultContainer) {
            resultContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function showDownloadButton(url) {
        if (downloadBtn) {
            downloadBtn.dataset.url = url;
            downloadBtn.disabled = false;
        }
    }

    // --- API FUNCTIONS ---

    // Upload file to CDN storage
    async function uploadFile(file) {
        const fileExtension = file.name.split('.').pop() || 'jpg';
        const uniqueId = generateNanoId();
        const fileName = uniqueId + '.' + fileExtension;
        
        // Step 1: Get signed URL
        const signedUrlResponse = await fetch(
            'https://api.chromastudio.ai/get-emd-upload-url?fileName=' + encodeURIComponent(fileName),
            { method: 'GET' }
        );
        
        if (!signedUrlResponse.ok) {
            throw new Error('Failed to get signed URL: ' + signedUrlResponse.statusText);
        }
        
        const signedUrl = await signedUrlResponse.text();
        
        // Step 2: PUT file
        const uploadResponse = await fetch(signedUrl, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type
            }
        });
        
        if (!uploadResponse.ok) {
            throw new Error('Failed to upload file: ' + uploadResponse.statusText);
        }
        
        // Step 3: Return download URL
        const downloadUrl = 'https://contents.maxstudio.ai/' + fileName;
        return downloadUrl;
    }

    // Submit generation job
    async function submitImageGenJob(imageUrl) {
        const endpoint = 'https://api.chromastudio.ai/image-gen';
        
        const body = {
            model: 'image-effects',
            toolType: 'image-effects',
            effectId: 'removeMustacheFromPhoto',
            imageUrl: imageUrl,
            userId: USER_ID,
            removeWatermark: true,
            isPrivate: true
        };
    
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'sec-ch-ua-platform': '"Windows"',
                'sec-ch-ua': '"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
                'sec-ch-ua-mobile': '?0'
            },
            body: JSON.stringify(body)
        });
        
        if (!response.ok) {
            throw new Error('Failed to submit job: ' + response.statusText);
        }
        
        const data = await response.json();
        return data;
    }

    // Poll job status
    async function pollJobStatus(jobId) {
        const baseUrl = 'https://api.chromastudio.ai/image-gen';
        const POLL_INTERVAL = 2000;
        const MAX_POLLS = 60;
        let polls = 0;
        
        while (polls < MAX_POLLS) {
            const response = await fetch(
                `${baseUrl}/${USER_ID}/${jobId}/status`,
                {
                    method: 'GET',
                    headers: { 'Accept': 'application/json, text/plain, */*' }
                }
            );
            
            if (!response.ok) {
                throw new Error('Failed to check status: ' + response.statusText);
            }
            
            const data = await response.json();
            
            if (data.status === 'completed') {
                return data;
            }
            
            if (data.status === 'failed' || data.status === 'error') {
                throw new Error(data.error || 'Job processing failed');
            }
            
            updateStatus('PROCESSING... (' + (polls + 1) + ')');
            await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
            polls++;
        }
        
        throw new Error('Job timed out after ' + MAX_POLLS + ' polls');
    }

    // --- EVENT HANDLERS ---

    // 1. File Selection & Auto-Upload
    async function handleFileSelect(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please upload a valid image file (JPG, PNG).');
            return;
        }

        try {
            // Show preview immediately using FileReader for better UX
            const reader = new FileReader();
            reader.onload = (e) => {
                showPreview(e.target.result);
            };
            reader.readAsDataURL(file);

            // Start actual upload
            updateStatus('UPLOADING...');
            
            const uploadedUrl = await uploadFile(file);
            currentUploadedUrl = uploadedUrl;
            
            // Update preview to use the remote URL to ensure consistency
            showPreview(uploadedUrl);
            
            updateStatus('READY');
            
        } catch (error) {
            updateStatus('ERROR');
            showError(error.message);
            // Reset UI on error
            resetUI();
        }
    }

    if (uploadZone) {
        uploadZone.addEventListener('click', () => fileInput.click());
        
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('drag-over'); // Ensure CSS supports this or use style
            uploadZone.style.borderColor = 'var(--primary)';
        });
        
        uploadZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('drag-over');
            uploadZone.style.borderColor = 'var(--border)';
        });
        
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('drag-over');
            uploadZone.style.borderColor = 'var(--border)';
            const file = e.dataTransfer.files[0];
            if (file) handleFileSelect(file);
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) handleFileSelect(file);
        });
    }

    // 2. Generate Button
    async function handleGenerate() {
        if (!currentUploadedUrl) return;
        
        try {
            showLoading();
            updateStatus('SUBMITTING...');
            
            // Step 1: Submit Job
            const jobData = await submitImageGenJob(currentUploadedUrl);
            
            updateStatus('QUEUED...');
            
            // Step 2: Poll Status
            const result = await pollJobStatus(jobData.jobId);
            
            // Step 3: Extract URL
            const resultItem = Array.isArray(result.result) ? result.result[0] : result.result;
            const resultUrl = resultItem?.mediaUrl || resultItem?.image;
            
            if (!resultUrl) {
                console.error('Response:', result);
                throw new Error('No image URL in response');
            }
            
            // Step 4: Display Result
            showResultMedia(resultUrl);
            showDownloadButton(resultUrl);
            
            updateStatus('COMPLETE');
            hideLoading();
            
        } catch (error) {
            hideLoading();
            updateStatus('ERROR');
            showError(error.message);
        }
    }

    if (generateBtn) {
        generateBtn.addEventListener('click', handleGenerate);
    }

    // 3. Reset Button
    function resetUI() {
        currentUploadedUrl = null;
        fileInput.value = '';
        
        if (previewImage) {
            previewImage.src = '';
            previewImage.classList.add('hidden');
        }
        if (uploadContent) uploadContent.classList.remove('hidden');
        if (removeImgBtn) removeImgBtn.classList.add('hidden');
        
        if (resultImage) {
            resultImage.src = '';
            resultImage.classList.add('hidden');
        }
        if (placeholderText) placeholderText.classList.remove('hidden');
        if (loadingState) loadingState.classList.add('hidden');
        
        if (generateBtn) {
            generateBtn.disabled = true;
            generateBtn.textContent = 'Remove Mustache';
        }
        if (resetBtn) resetBtn.disabled = true;
        if (downloadBtn) {
            downloadBtn.disabled = true;
            downloadBtn.dataset.url = '';
        }
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', resetUI);
    }
    
    if (removeImgBtn) {
        removeImgBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            resetUI();
        });
    }

    // 4. Download Button (Robust Proxy Strategy)
    if (downloadBtn) {
        downloadBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const url = downloadBtn.dataset.url;
            if (!url) return;
            
            const originalText = downloadBtn.textContent;
            downloadBtn.textContent = 'Downloading...';
            downloadBtn.disabled = true;
            
            function downloadBlob(blob, filename) {
                const blobUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = filename;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
            }
            
            function getExtension(url, contentType) {
                if (contentType) {
                    if (contentType.includes('jpeg') || contentType.includes('jpg')) return 'jpg';
                    if (contentType.includes('png')) return 'png';
                }
                const match = url.match(/\.(jpe?g|png|webp)/i);
                return match ? match[1].toLowerCase().replace('jpeg', 'jpg') : 'png';
            }
            
            try {
                // Strategy 1: Proxy
                const proxyUrl = 'https://api.chromastudio.ai/download-proxy?url=' + encodeURIComponent(url);
                const response = await fetch(proxyUrl);
                if (!response.ok) throw new Error('Proxy failed');
                
                const blob = await response.blob();
                const ext = getExtension(url, response.headers.get('content-type'));
                downloadBlob(blob, 'clean_photo_' + generateNanoId(8) + '.' + ext);
                
            } catch (proxyErr) {
                console.warn('Proxy failed, trying direct fetch:', proxyErr.message);
                
                try {
                    // Strategy 2: Direct Fetch
                    const fetchUrl = url + (url.includes('?') ? '&' : '?') + 't=' + Date.now();
                    const response = await fetch(fetchUrl, { mode: 'cors' });
                    
                    if (response.ok) {
                        const blob = await response.blob();
                        const ext = getExtension(url, response.headers.get('content-type'));
                        downloadBlob(blob, 'clean_photo_' + generateNanoId(8) + '.' + ext);
                    } else {
                        throw new Error('Direct fetch failed');
                    }
                } catch (fetchErr) {
                    alert('Download failed due to browser security restrictions. Please right-click the result image and select "Save Image As".');
                }
            } finally {
                downloadBtn.textContent = originalText;
                downloadBtn.disabled = false;
            }
        });
    }
});